class HTMLParser {
    getParsedData(text) {
        if(text==undefined) return "";
        if(!this.jeLiPrazan(text)){
			return this.obradiHTML(text);
        } else
            return text;
    }
	
	jeLiPrazan = (element) => {
		return !element.includes("<")
	}

	obradiHTML = (text) => {
		text = this.makniKomentare(text);
            let result = "";
			let elements = text.split('>');
			for (let element of elements){
				element = ">" + element + ">";
				result += this.obradiHTMLElement(element);
			}
			
			return result.trim();
	}

	makniKomentare = (text) =>{
		text.replace('<!--[^<>]*-->','');
		text.replace("<>","");
		text.trim();
		return text;
	} 

	obradiHTMLElement = (element) => {
		if(this.jeLiPrazan(element)) return "";

		let finalText = this.izvadiCistiText(element);
		if(finalText.length == 0) return "";
		if(this.jeliListItem(element)) 
			finalText="- "+finalText;
		
		return finalText + "\n";
	}

	izvadiCistiText = (element) =>{
		let endTextPosition=element.indexOf("<");
		let startTextPosition=element.indexOf('>')+1;
		return element.substring(startTextPosition,endTextPosition).trim();
	}

	jeliListItem = (element) => {
		return element.indexOf("</li>")!=-1;
	}
}

module.exports = HTMLParser;
