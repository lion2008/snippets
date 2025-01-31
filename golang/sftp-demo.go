// https://sftptogo.com/blog/go-sftp/
// SFTP server in a URI format: sftp://user:password@host
package main

import (
    "fmt"
    "io"
    "os"
    "net"
    "net/url"
    "bufio"
    "strings"
    "path/filepath"

    "golang.org/x/crypto/ssh"
    "golang.org/x/crypto/ssh/agent"

    "github.com/pkg/sftp"
)

func main() {
    // Get SFTP To Go URL from environment
    rawurl := os.Getenv("SFTPTOGO_URL")

    parsedUrl, err := url.Parse(rawurl)
    if err != nil {
        fmt.Fprintf(os.Stderr, "Failed to parse SFTP To Go URL: %s\n", err)
        os.Exit(1)
    }

    // Get user name and pass
    user := parsedUrl.User.Username()
    pass, _ := parsedUrl.User.Password()

    // Parse Host and Port
    host := parsedUrl.Host
    // Default SFTP port
    port := 22

    hostKey := getHostKey(host)

    fmt.Fprintf(os.Stdout, "Connecting to %s ...\n", host)

    var auths []ssh.AuthMethod

    // Try to use $SSH_AUTH_SOCK which contains the path of the unix file socket that the sshd agent uses 
    // for communication with other processes.
    if aconn, err := net.Dial("unix", os.Getenv("SSH_AUTH_SOCK")); err == nil {
        auths = append(auths, ssh.PublicKeysCallback(agent.NewClient(aconn).Signers))
    }

    // Use password authentication if provided
    if pass != "" {
        auths = append(auths, ssh.Password(pass))
    }
    
    // Initialize client configuration
    config := ssh.ClientConfig{
        User: user,
        Auth: auths,
        // Uncomment to ignore host key check
        //HostKeyCallback: ssh.InsecureIgnoreHostKey(),
        HostKeyCallback: ssh.FixedHostKey(hostKey),
    }

    addr := fmt.Sprintf("%s:%d", host, port)

    // Connect to server
    conn, err := ssh.Dial("tcp", addr, &config)
    if err != nil {
        fmt.Fprintf(os.Stderr, "Failed to connecto to [%s]: %v\n", addr, err)
        os.Exit(1)
    }

    defer conn.Close()

    // Create new SFTP client
    sc, err := sftp.NewClient(conn)
    if err != nil {
        fmt.Fprintf(os.Stderr, "Unable to start SFTP subsystem: %v\n", err)
        os.Exit(1)
    }
    defer sc.Close()

    //*
    //* List working directory files
    //*
    listFiles(*sc, ".")
    fmt.Fprintf(os.Stdout, "\n")

    //*
    //* Upload local file to remote file
    //*
    uploadFile(*sc, "./local.txt", "./remote.txt")
    fmt.Fprintf(os.Stdout, "\n")

    //*
    //* Download remote file to local file
    //*
    downloadFile(*sc, "./remote.txt", "./download.txt")
    fmt.Fprintf(os.Stdout, "\n")
}

func listFiles(sc sftp.Client, remoteDir string) (err error) {
    fmt.Fprintf(os.Stdout, "Listing [%s] ...\n\n", remoteDir)
    
    files, err := sc.ReadDir(remoteDir)
    if err != nil {
        fmt.Fprintf(os.Stderr, "Unable to list remote dir: %v\n", err)
        return
    }

    for _, f := range files {
        var name, modTime, size string

        name = f.Name()
        modTime = f.ModTime().Format("2006-01-02 15:04:05")
        size = fmt.Sprintf("%12d", f.Size())

        if f.IsDir() {
            name = name + "/"
            modTime = ""
            size = "PRE"
        }
        // Output each file name and size in bytes
        fmt.Fprintf(os.Stdout, "%19s %12s %s\n", modTime, size, name)
    }

    return
}


// Upload file to sftp server
func uploadFile(sc sftp.Client, localFile, remoteFile string) (err error) {
    fmt.Fprintf(os.Stdout, "Uploading [%s] to [%s] ...\n", localFile, remoteFile)

    srcFile, err := os.Open(localFile)
    if err != nil {
        fmt.Fprintf(os.Stderr, "Unable to open local file: %v\n", err)
        return
    }
    defer srcFile.Close()

    // Make remote directories recursion
    parent := filepath.Dir(remoteFile)
    path := string(filepath.Separator)
    dirs := strings.Split(parent, path)
    for _, dir := range dirs {
        path = filepath.Join(path, dir)
        sc.Mkdir(path)
    }

    // Note: SFTP To Go doesn't support O_RDWR mode
    dstFile, err := sc.OpenFile(remoteFile, (os.O_WRONLY|os.O_CREATE|os.O_TRUNC))
    if err != nil {
        fmt.Fprintf(os.Stderr, "Unable to open remote file: %v\n", err)
        return
    }
    defer dstFile.Close()

    bytes, err := io.Copy(dstFile, srcFile)
    if err != nil {
        fmt.Fprintf(os.Stderr, "Unable to upload local file: %v\n", err)
        os.Exit(1)
    }
    fmt.Fprintf(os.Stdout, "%d bytes copied\n", bytes)
    
    return
}

// Download file from sftp server
func downloadFile(sc sftp.Client, remoteFile, localFile string) (err error) {

    fmt.Fprintf(os.Stdout, "Downloading [%s] to [%s] ...\n", remoteFile, localFile)
    // Note: SFTP To Go doesn't support O_RDWR mode
    srcFile, err := sc.OpenFile(remoteFile, (os.O_RDONLY))
    if err != nil {
        fmt.Fprintf(os.Stderr, "Unable to open remote file: %v\n", err)
        return
    }
    defer srcFile.Close()

    dstFile, err := os.Create(localFile)
    if err != nil {
        fmt.Fprintf(os.Stderr, "Unable to open local file: %v\n", err)
        return
    }
    defer dstFile.Close()

    bytes, err := io.Copy(dstFile, srcFile)
    if err != nil {
        fmt.Fprintf(os.Stderr, "Unable to download remote file: %v\n", err)
        os.Exit(1)
    }
    fmt.Fprintf(os.Stdout, "%d bytes copied\n", bytes)
    
    return
}

// Get host key from local known hosts
func getHostKey(host string) ssh.PublicKey {
    // parse OpenSSH known_hosts file
    // ssh or use ssh-keyscan to get initial key
    file, err := os.Open(filepath.Join(os.Getenv("HOME"), ".ssh", "known_hosts"))
    if err != nil {
        fmt.Fprintf(os.Stderr, "Unable to read known_hosts file: %v\n", err)
        os.Exit(1)
    }
    defer file.Close()
 
    scanner := bufio.NewScanner(file)
    var hostKey ssh.PublicKey
    for scanner.Scan() {
        fields := strings.Split(scanner.Text(), " ")
        if len(fields) != 3 {
            continue
        }
        if strings.Contains(fields[0], host) {
            var err error
            hostKey, _, _, _, err = ssh.ParseAuthorizedKey(scanner.Bytes())
            if err != nil {
                fmt.Fprintf(os.Stderr, "Error parsing %q: %v\n", fields[2], err)
                os.Exit(1)
            }
            break
        }
    }
 
    if hostKey == nil {
        fmt.Fprintf(os.Stderr, "No hostkey found for %s", host)
        os.Exit(1)
    }
 
    return hostKey
}