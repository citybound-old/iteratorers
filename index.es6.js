class It {
	constructor () {
		this.op = id;
	}

	of (iterable) {
		// might return normal or iterator function
		return this.op(iterable);
	}

	chain (second) {
		this.op = compose(this.op, second);
		return this;
	}

	static concat (first, second) {
		// this only returns an iterating function,
		// it doesn't run it yet!
		return function * concatenation () {
			yield* first; yield* second;
		};
	}

	// Iterators
	cycle () {return this.chain(cycler());}
	flatten () {return this.chain(flattener());}
	map (mapping) {return this.chain(mapper(mapping));}
	filter (predicate) {return this.chain(filterer(predicate));}
	take (n) {return this.chain(taker(n));}
	drop (n) {return this.chain(dropper(n));}
	windows (size) {return this.chain(windower(size));}
	chunks (size) {return this.chain(chunker(size));}
	slice (start, end) {return this.chain(compose(dropper(start - 1), taker(start - end)));}
	common (otherIterable) {return this.chain(commoner(otherIterable));}
	zip (otherIterable) {return this.chain(zipper(otherIterable));}
	append (otherIterable) {return this.chain(appender(otherIterable));}

	// Reducers
	reduce (step, initial) {return this.chain(reducerer(step, initial));}
	first () {return this.chain(firster());}
	find (predicate) {return this.chain(finder(predicate));}
	has (item) {return this.chain(haser(item));}
	extreme (mapping) {return this.chain(extremer(mapping));}
	max (mapping) {return this.chain(maxer(mapping));}
	min (mapping) {return this.chain(miner(mapping));}
	all (predicate) {return this.chain(aller(predicate));}
	any (predicate) {return this.chain(anyer(predicate));}
	unique () {return this.chain(uniquer());}
	empty () {return this.chain(emptyer());}
}

function createIteration() {return new It();}
createIteration.concat = It.concat;
export default createIteration;

function id (iterable) {return iterable;}

function compose (first, second) {
	return function composition (iterable) {
		return second(first(iterable));
	};
}

// Iterator-ers

function cycler () {
	return function * cycle (iterable) {
		let seenValues = [];

		for (let value of iterable) {
			seenValues.push(value);
			yield value;
		}

		while (true) yield* seenValues;
	};
}

function flattener () {
	return function * flatten (iterable) {
		// for some reason yield* doesn't compile in here
		for (let subIterable of iterable) yield* subIterable;
	};
}

function mapper (mapping) {
	return function * map (iterable) {for (let value of iterable) yield mapping(value);};
}

function filterer (predicate) {
	return function * filter (iterable) {
		for (let value of iterable) if (predicate(value)) yield value;
	};
}

function taker (n) {
	return function * take (iterable) {
		let left = n;
		for (let value of iterable) {
			if (left === 0) return;
			left--; yield value;
		}
	};
}

function dropper (n) {
	return function * drop (iterable) {
		let startIn = n;
		for (let value of iterable) {
			if (startIn === 0) yield value;
			else startIn--;
		}
	};
}

function windower (size) {
	return function * windows (iterable) {
		let window = [];

		for (let value of iterable) {
			window.push(value);
			if (window.length === size) {
				yield window.slice();
				window.shift();
			}
		}
	};
}

function chunker (size) {
	return function * chunk (iterable) {
		let group = [];

		for (let value of iterable) {
			group.push(value);
			if (group.length === size) {
				yield group;
				group = [];
			}
		}
	};
}

function commoner (otherIterable) {
	let otherItems = new Set(otherIterable);
	return function * common (iterable) {
		for (let value of (new Set(iterable))) if (otherItems.has(value)) yield value;
	};
}

function zipper (otherIterable) {
	otherIterable = otherIterable[Symbol.iterator]();
	return function * zip (iterable) {
		for (let value of iterable) {
			let other = otherIterable.next();
			if (other.done) break;
			yield [value, other.value];
		}
	};
}

function appender (otherIterable) {
	return function * append (iterable) {
		yield* iterable;
		yield* otherIterable;
	};
}

// Reducer-ers

function reducerer (step, initial) {
	return function reduce (iterable) {
		let reducedValue = initial;
		for (let value of iterable) reducedValue = step(reducedValue, value);
		return reducedValue;
	};
}

function firster () {
	return function first (iterable) {
		return iterable.next().value;
	};
}

function finder (predicate) {
	return function find (iterable) {
		for (let value of iterable) if (predicate(value)) return value;
	};
}

function haser (item) {
	return function has (iterable) {
		for (let value of iterable) if (value === item) return true;
	};
}

function extremer (mapping) {
	return function extreme (iterable) {
		let bestMetric;
		let best;
		let rest = [];

		for (let value of iterable) {
			let metric = mapping(value);
			if (best === undefined || metric > bestMetric) {
				if (best !== undefined) rest.push(best);
				best = value;
				bestMetric = metric;
			} else rest.push(value);
		}

		return {best, bestMetric, rest};
	};
}

function maxer (mapping) {
	return function max (iterable) {
		let {best, bestMetric: maximum, rest} = extremer(mapping)(iterable);
		return {best, max: maximum, rest};
	};
}

function miner (mapping) {
	let negativeMapping = (i) => - mapping(i);
	return function min (iterable) {
		let {best, bestMetric: negativeMin, rest} = extremer(negativeMapping)(iterable);
		return {best, min: -negativeMin, rest};
	};
}

function aller (predicate) {
	return function all (iterable) {
		for (let value of iterable) if (!predicate(value)) return false;
		return true;
	};
}

function anyer (predicate) {
	return function  any (iterable) {
		for (let value of iterable) if (predicate(value)) return true;
		return false;
	};
}

function uniquer () {
	return function unique (iterable) {

		//return new Set(iterable);
		let s = new Set();
		for (let value of iterable) s.add(value);
		return s;
	};
}

function emptyer () {
	return function empty (iterable) {
		return iterable.next().done;
	};
}