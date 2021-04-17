module.exports = {   clickAndWait: async (page,path)=> {
        await Promise.all([
              page.click(path),
              page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ]);
},
clickOnXPath:async (page,xpath)=>{
      await page.waitForXPath(xpath)
      let item = await page.$x(xpath).catch();
      await item[0].click()
},
isXPathThere:async (page,xpath)=>{
      let result = await page.$x(xpath).catch();
      if(result[0]){
            return true
      }
      return false
}}