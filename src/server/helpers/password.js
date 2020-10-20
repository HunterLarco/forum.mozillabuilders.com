import friendlyWords from '@fly/friendly-words';

export function createFriendlyPassword() {
  return [
    randomWord(friendlyWords.predicates),
    randomWord(friendlyWords.objects),
    randomWord(friendlyWords.teams),
  ].join('-');
}

function randomWord(words) {
  return words[Math.floor(Math.random() * words.length)];
}
