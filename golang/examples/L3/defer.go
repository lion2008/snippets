package main

import (
	"fmt"
	"os"
)

func main() {
	
	f := createFile("/tmp/defer.txt")
	defer closeFile(f)
	writeFile(f)
}

func createFile(p string) *os.File {
	fmt.Println("Createing")
	f, err := os.Create(p)
	if err != nil {
		panic(err)
	}
	return f
}

func writeFile(f *os.File) {
	fmt.Println("writing")
	fmt.Println(f, "data")
}

func closeFile(f *os.File) {
	fmt.Println("closing")
	f.Close()
}