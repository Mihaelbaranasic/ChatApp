const JEST = require("jest");
const HTMLParser = require("./htmlParser.js");

describe('htmlParser', () => {
    let htmlParser;

    beforeEach(() => {
        htmlParser = new HTMLParser();
    });

    test('metodaGetParsedDataSeMožePozvati', () => {
        htmlParser.getParsedData();
    });

    test('testGivenPureTextWhenGetParsedDataThenReturnSameText', () => {
        let odgovor = htmlParser.getParsedData("PureTextWithNoHTML");
        expect(odgovor).toBe('PureTextWithNoHTML');
    });

    test('testGivenOnlyHTMLCodeWhenGetParsedDataThenReturnEmptyText', () => {
        let odgovor = htmlParser.getParsedData("<p></p>");
        expect(odgovor).toBe('');
    });

    test('testGivenNoTextWhenGetParsedDataThenReturnEmptyText', () => {
        let odgovor = htmlParser.getParsedData("");
        expect(odgovor).toBe('');
    });

    test('testGivenHTMLCodeSPANWithTextWhenGetParsedDataThenReturnOnlyText', () => {
        let odgovor = htmlParser.getParsedData("<span>TextInSPAN</span>");
        expect(odgovor).toBe('TextInSPAN');
    });

    test('testGivenHTMLCodeParagraphWithTextWhenGetParsedDataThenReturnOnlyText', () => {
        let odgovor = htmlParser.getParsedData("<p>TextInParagraph</p>");
        expect(odgovor).toBe('TextInParagraph');
    });

    test('testGivenHTMLCodeH1WithTextWhenGetParsedDataThenReturnOnlyText', () => {
        let odgovor = htmlParser.getParsedData("<h1>TextInH1</h1>");
        expect(odgovor).toBe('TextInH1');
    });

    test('testGivenMultipleHTMLelementsWithTextWhenGetParsedDataThenReturnOnlyText', () => {
        let odgovor = htmlParser.getParsedData("<h1>TextInH1</h1><p>TextInP</p><span>TextInSPAN</span>");
        expect(odgovor).toBe("TextInH1\nTextInP\nTextInSPAN");
    });

    test('testGivenNestedHTMLelementWithTextWhenGetParsedDataThenReturnOnlyText', () => {
        let odgovor = htmlParser.getParsedData("<h1>TextInH1<p>TextInP<span>TextInSPAN</span></p></h1>");
        expect(odgovor).toBe("TextInH1\nTextInP\nTextInSPAN");
    });

    test('testGivenNestedHTMLelementInARowWithTextWhenGetParsedDataThenReturnOnlyText', () => {
        let odgovor = htmlParser.getParsedData("<h1><p><span>TextInH1-TextInP-TextInSPAN</span></p></h1>");
        expect(odgovor).toBe("TextInH1-TextInP-TextInSPAN");
    });

    test('testGivenNestedAndMultipleHTMLelementWithTextWhenGetParsedDataThenReturnOnlyText', () => {
        let odgovor = htmlParser.getParsedData("<h1><p><span>TextInH1-TextInP-TextInSPAN</span></p></h1><h1><p><span>TextInH1-TextInP-TextInSPAN</span></p></h1>");
        expect(odgovor).toBe("TextInH1-TextInP-TextInSPAN\nTextInH1-TextInP-TextInSPAN");
    });

    test('testGivenNestedAndMultipleHTMLelementAndMixedWithTextWhenGetParsedDataThenReturnOnlyText', () => {
        let odgovor = htmlParser.getParsedData("<h1><p>TextInH1-TextInP<span>TextInH1-TextInP-TextInSPAN</span></p></h1><h1><p><span>TextInH1-TextInP-TextInSPAN</span></p></h1>");
        expect(odgovor).toBe("TextInH1-TextInP\nTextInH1-TextInP-TextInSPAN\nTextInH1-TextInP-TextInSPAN");
    });

    test('testGivenHTMLCommentWithTextWhenGetParsedDataThenReturnEmptyText', () => {
        let odgovor = htmlParser.getParsedData('<!-- wp:heading {\"level\":1,\"align\":\"center\"} -->');
        expect(odgovor).toBe("");
    });

    test('testGivenMultipleHTMLCommentWithTextWhenGetParsedDataThenReturnEmptyText', () => {
        let odgovor = htmlParser.getParsedData("<!-- /wp:heading -->\n\n<!-- wp:paragraph {\\\"align\\\":\\\"left\\\",\\\"fontSize\\\":\\\"regular\\\"} -->");
        expect(odgovor).toBe("");
    });

    test('testGivenEmptyListWithOneElemntReturnEmptyString', () => {
        let odgovor = htmlParser.getParsedData("<ul><li></li></ul>");
        expect(odgovor).toBe("");
    });

    test('testGivenListWithOneElemntWithTextReturnMinusAndText', () => {
        let odgovor = htmlParser.getParsedData("<ul><li>Pero</li></ul>");
        expect(odgovor).toBe("- Pero");
    });

    test('testGivenListWithTwoElemntsWithTextReturnMinusAndText',()=>{
        let odgovor = htmlParser.getParsedData("<ul><li>Pero</li><li>Mato</li></ul>");
        expect(odgovor).toBe("- Pero\n- Mato");
    })

    test('testGivenTextBeforeAndAfterAndInElementTextReturnTextInNewLine',()=>{
        let odgovor = htmlParser.getParsedData("bla<h1>bla</h1>bla");
        expect(odgovor).toBe("bla\nbla\nbla");
    })

    test('testPrihvatljivosti',()=>{
        let odgovor = htmlParser.getParsedData(ulaz);
        expect(odgovor).toBe(izlaz);
    })

    var ulaz = "<body>\n"+
    "<!-- LOGO --><div id=\"logo\" style=\"background: black\">\n"+
	"	<a href=\"http://www.foi.unizg.hr/hr\" title=\"FOI Naslovnica\">\n"+
	"		<img src=\"http://www.foi.unizg.hr/sites/default/files/hr_logo.jpg\" alt=\"FOI\">\n"+
	"	</a>\n"+
	"</div>\n"+
	"<h1><i>Predmeti za <b>Web programiranje</b></i></h1>\n"+
	"<b>Nastavnici</b>\n"+
	"<ol>\n"+
	"	<li>prof.dr.sc. Dragutin Kermek</li>\n"+
	"	<li>doc. dr. sc. Matija Novak</li>\n"+
	"	<li>Matija Kaniški, mag. inf.</li>\n"+
	"	<li>Iva Levak, mag. inf.</li>\n"+
	"</ol>\n"+
    "</body>";

    var izlaz = "Predmeti za\nWeb programiranje\n"+
    "Nastavnici\n"+
    "- prof.dr.sc. Dragutin Kermek\n"+
    "- doc. dr. sc. Matija Novak\n"+
    "- Matija Kaniški, mag. inf.\n"+
    "- Iva Levak, mag. inf.";
});
