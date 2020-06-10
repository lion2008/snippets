    // This example requires the Chilkat API to have been previously unlocked.
    // See Global Unlock Sample for sample code.

    var success bool

    // This example will send an XML file in the HTTP request body.  
    // First we'll construct the XML, then we'll compute the MD5 digest which needs to be added as a query param..

    // Construct the following XML.   (This is just a sample XML body..)

    // <AmazonEnvelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    //     xsi:noNamespaceSchemaLocation="amzn-envelope.xsd">
    //   <Header>
    //     <DocumentVersion>1.01</DocumentVersion>
    //     <MerchantIdentifier>M_EXAMPLE_123456</MerchantIdentifier>
    //   </Header>
    //   <MessageType>Product</MessageType>
    //   <PurgeAndReplace>false</PurgeAndReplace>
    //   <Message>
    //     <MessageID>1</MessageID>
    //     <OperationType>Update</OperationType>
    //     <Product>
    //       <SKU>56789</SKU>
    //       <StandardProductID>
    //         <Type>ASIN</Type>
    //         <Value>B0EXAMPLEG</Value>
    //       </StandardProductID>
    //       <ProductTaxCode>A_GEN_NOTAX</ProductTaxCode>
    //       <DescriptionData>
    //         <Title>Example Product Title</Title>
    //         <Brand>Example Product Brand</Brand>
    //         <Description>This is an example product description.</Description>
    //         <BulletPoint>Example Bullet Point 1</BulletPoint>
    //         <BulletPoint>Example Bullet Point 2</BulletPoint>
    //         <MSRP currency="USD">25.19</MSRP>
    //         <Manufacturer>Example Product Manufacturer</Manufacturer>
    //         <ItemType>example-item-type</ItemType>
    //       </DescriptionData>
    //       <ProductData>
    //         <Health>
    //           <ProductType>
    //             <HealthMisc>
    //               <Ingredients>Example Ingredients</Ingredients>
    //               <Directions>Example Directions</Directions>
    //             </HealthMisc>
    //           </ProductType>
    //         </Health>
    //       </ProductData>
    //     </Product>
    //   </Message>
    // </AmazonEnvelope>

    // This code was generated by pasting the above XML into the online tool at http://tools.chilkat.io/xmlCreate.cshtml
    xml := chilkat.NewXml()
    xml.SetTag("AmazonEnvelope")
    xml.AddAttribute("xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance")
    xml.AddAttribute("xsi:noNamespaceSchemaLocation","amzn-envelope.xsd")
    xml.UpdateChildContent("Header|DocumentVersion","1.01")
    xml.UpdateChildContent("Header|MerchantIdentifier","M_EXAMPLE_123456")
    xml.UpdateChildContent("MessageType","Product")
    xml.UpdateChildContent("PurgeAndReplace","false")
    xml.UpdateChildContent("Message|MessageID","1")
    xml.UpdateChildContent("Message|OperationType","Update")
    xml.UpdateChildContent("Message|Product|SKU","56789")
    xml.UpdateChildContent("Message|Product|StandardProductID|Type","ASIN")
    xml.UpdateChildContent("Message|Product|StandardProductID|Value","B0EXAMPLEG")
    xml.UpdateChildContent("Message|Product|ProductTaxCode","A_GEN_NOTAX")
    xml.UpdateChildContent("Message|Product|DescriptionData|Title","Example Product Title")
    xml.UpdateChildContent("Message|Product|DescriptionData|Brand","Example Product Brand")
    xml.UpdateChildContent("Message|Product|DescriptionData|Description","This is an example product description.")
    xml.UpdateChildContent("Message|Product|DescriptionData|BulletPoint","Example Bullet Point 1")
    xml.UpdateChildContent("Message|Product|DescriptionData|BulletPoint[1]","Example Bullet Point 2")
    xml.UpdateAttrAt("Message|Product|DescriptionData|MSRP",true,"currency","USD")
    xml.UpdateChildContent("Message|Product|DescriptionData|MSRP","25.19")
    xml.UpdateChildContent("Message|Product|DescriptionData|Manufacturer","Example Product Manufacturer")
    xml.UpdateChildContent("Message|Product|DescriptionData|ItemType","example-item-type")
    xml.UpdateChildContent("Message|Product|ProductData|Health|ProductType|HealthMisc|Ingredients","Example Ingredients")
    xml.UpdateChildContent("Message|Product|ProductData|Health|ProductType|HealthMisc|Directions","Example Directions")

    // Get the MD5 hash..
    crypt := chilkat.NewCrypt2()
    crypt.SetHashAlgorithm("md5")
    contentMd5Value := crypt.HashStringENC(*xml.GetXml())

    rest := chilkat.NewRest()

    // Connect to the Amazon MWS REST server.
    // 
    // Make sure to connect to the correct Amazon MWS Endpoing, otherwise
    // you'll get an HTTP 401 response code.
    // 
    // The possible servers are:
    // 
    // North America (NA) 	https://mws.amazonservices.com
    // Europe (EU) 	https://mws-eu.amazonservices.com
    // India (IN) 	https://mws.amazonservices.in
    // China (CN) 	https://mws.amazonservices.com.cn
    // Japan (JP) 	https://mws.amazonservices.jp 
    // 
    bTls := true
    port := 443
    bAutoReconnect := true
    success = rest.Connect("mws.amazonservices.com",port,bTls,bAutoReconnect)

    rest.SetHost("mws.amazonservices.com")

    rest.AddQueryParam("AWSAccessKeyId","0PB842ExampleN4ZTR2")
    rest.AddQueryParam("Action","SubmitFeed")
    rest.AddQueryParam("FeedType","_POST_PRODUCT_DATA_")
    rest.AddQueryParam("MWSAuthToken","amzn.mws.4ea38b7b-f563-7709-4bae-87aeaEXAMPLE")
    rest.AddQueryParam("MarketplaceId.Id.1","ATVExampleDER")
    rest.AddQueryParam("SellerId","A1XExample5E6")
    rest.AddQueryParam("ContentMD5Value",*contentMd5Value)
    rest.AddQueryParam("SignatureMethod","HmacSHA256")
    rest.AddQueryParam("SignatureVersion","2")
    rest.AddQueryParam("Version","2009-01-01")

    // Add the MWS Signature param.  (Also adds the Timestamp parameter using the curent system date/time.)
    rest.AddMwsSignature("POST","/Feeds/2009-01-01","mws.amazonservices.com","MWS_SECRET_ACCESS_KEY_ID")

    rest.AddHeader("Content-Type","text/xml")
    responseXml := rest.FullRequestString("POST","/Feeds/2009-01-01",*xml.GetXml())
    if rest.LastMethodSuccess() != true {
        fmt.Println(rest.LastErrorText())
        return
    }

    if rest.ResponseStatusCode() != 200 {
        // Examine the request/response to see what happened.
        fmt.Println("response status code = ", rest.ResponseStatusCode())
        fmt.Println("response status text = ", rest.ResponseStatusText())
        fmt.Println("response header: ", rest.ResponseHeader())
        fmt.Println("response body: ", *responseXml)
        fmt.Println("---")
        fmt.Println("LastRequestStartLine: ", rest.LastRequestStartLine())
        fmt.Println("LastRequestHeader: ", rest.LastRequestHeader())
    }

    // Examine the XML returned in the response body.
    fmt.Println(*responseXml)
    fmt.Println("----")
    fmt.Println("Success.")