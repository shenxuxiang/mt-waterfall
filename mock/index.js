const http = require('http');
const path = require('path');
const fs = require('fs');

const sufName = (url) => {
	const end = url.lastIndexOf('/');
	return url.slice(end);
}

const createServer = http.createServer(async (req, res) => {
	const { url } = req;
	if (/^\/(index|index\.html)?$/.test(url)) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		const filePath = path.resolve('./build/index.html');
		fs.createReadStream(filePath).pipe(res);
	} else if (/\.(jpg|png|jpeg)/i.test(url)) {
		const imgPath = path.resolve(`./build/static/images/${sufName(url)}`);
		const img = await fs.readFileSync(imgPath);
		res.writeHead(200, { 'Content-Type': 'text/image' });
		res.end(img);
	} else if (/\.css/i.test(url)) {
		const cssPath = path.resolve(`./build/static/css/${sufName(url)}`);
		const css = await fs.readFileSync(cssPath);
		res.writeHead(200, { 'Content-Type': 'text/css' });
		res.end(css);
	} else if (/\.js/i.test(url)) {
		const jsPath = path.resolve(`./build/static/js/${sufName(url)}`);
		const js = await fs.readFileSync(jsPath);
		res.writeHead(200, { 'Content-Type': 'text/js' });
		res.end(js);
	}
});

createServer.listen(8080, function() {
  console.log('server start at 8080');
});
