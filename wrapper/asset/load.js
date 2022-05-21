/**
 * route
 * asset loading
 */
// stuff
const Asset = require("./main");

/**
 * Loads an asset file.
 * @param {http.IncomingMessage} req 
 * @param {http.OutgoingMessage} res 
 * @param {url.UrlWithParsedQuery} url 
 * @returns {boolean | void}
 */
module.exports = async function (req, res, url) {
	switch (req.method) {
		case "GET": {
			const match = req.url.match(/\/assets\/([^/]+)$/);
			if (!match) return;

			const aId = match[1]; // get asset id
			const b = Asset.load(aId);
			b ? (res.statusCode = 200, res.end(b)) :
				(res.statusCode = 404, res.end());
			return true;
		}

		case "POST": {
			switch (url.pathname) {
				case "/goapi/getAssetEx/":
				case "/goapi/getAsset/": {
					const aId = req.body.assetId || req.body.enc_asset_id;
					if (!aId) {
						res.statusCode = 400;
						res.end();
						return true;
					}
	
					const b = Asset.load(aId);
					if (b) {
						res.setHeader("Content-Length", b.length);
						res.setHeader("Content-Type", "audio/mp3");
						res.end(b);
					} else {
						res.statusCode = 404;
						res.end();
					};
					return true;
				} default: return;
			}
		}
		default: return;
	}
}