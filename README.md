# iteratorers

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Composable Iterations.

## Usage Example

Iterating over a sliding window of values and mapping:
```javascript
import It from 'iteratorers';

const connectingLines = It().windows(2).map([start, end] => new Line(start, end));

const dots = [vec2(0, 0), vec2(1, 0), vec2(1, 1), vec2(0, 1)];

for (let line of connectingLines.of(dots)) graphics.draw(line);
```

A function that returns an Iteratorer ("iteration recipe") and a Reducerer.
```javascript
import It from 'iteratorers';

const wordsStartingWith = (letter) =>
    It().filter(word => word[0] === letter);
const shortest = It().min(word => word.length);

const words = ["Apfel", "Orange", "Ananas", "Birne", "Mandarine"];

const {best: shortestWord, min: shortestWordLength} = shortest.of(wordsStartingWith("A").of(words));

console.log(`The shortest word that starts with A is ${shortestWord} (${shortestWordLength} letters)`;
```

## Contribution

Goals, wishes and bugs are managed as GitHub Issues - if you want to help, have a look there and submit your work as pull requests.
Your help is highly welcome! :)

## License

MIT, see [LICENSE.md](http://github.com/citybound/iteratorers/blob/master/LICENSE.md) for details.
