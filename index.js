/**
 * Parses TGF string.
 *
 * @param {String} string
 * @returns {Object}
 */
exports.parse = function (string) {

	var nodes = [];
	var edges = [];
	var parts = string.split(/^\s*#\s*$/m);
	var lineNumber = 1;

	if (parts.length !== 2) {
		throw new SyntaxError(errorMessage());
	}

	function match(string, regexp, callback) {

		string.split(/\r?\n/).forEach(function (line) {

			var matches;

			line = line.trim();

			if (line.length) {
				matches = line.match(regexp);

				if (!matches) {
					throw new SyntaxError(errorMessage(lineNumber, line));
				}

				callback.apply(null, matches);
			}

			lineNumber++;
		});
	}

	match(parts[0], /^(\d+)\s+(.+)$/, function (all, id, label) {

		nodes.push({
			id: parseInt(id, 10),
			label: label
		});
	});

	lineNumber++;

	match(parts[1], /^(\d+)\s+(\d+)$/, function (all, source, target) {

		edges.push({
			source: parseInt(source, 10),
			target: parseInt(target, 10)
		});
	});

	return {
		nodes: nodes,
		edges: edges
	};
};

/**
 * Stringifies TGF object.
 *
 * @param {Object} object
 * @param {Object} [options]
 * @returns {String}
 */
exports.stringify = function (object, options) {

	if (typeof object.toJSON === 'function') {
		object = object.toJSON();
	}

	options = options || {};

	var nodes = object.nodes || [];
	var edges = object.edges || [];
	var lines = [];

	nodes.forEach(function (node) {

		lines.push('' + node.id + ' ' + node.label);
	});

	lines.push('#');

	edges.forEach(function (edge) {

		lines.push('' + edge.source + ' ' + edge.target);
	});

	return lines.join(options.lineBreak || '\n');
};

function errorMessage(lineNumber, line) {

	var message = 'TGF parse error';

	if (lineNumber) {
		message += ', line ' + lineNumber;
	}

	if (line) {
		message += ': ' + line;
	}

	return message;
}
