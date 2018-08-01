function wrap(str, width) {
  if (str === null) {
    return str;
  }
  const regexString = `.{1,${width}}([\\s\u200B]+|$)|[^\\s\u200B]+?([\\s\u200B]+|$)`;
  var re = new RegExp(regexString, 'g');
  var lines = str.match(re) || [];
  var result = lines
    .map(line => {
      return line.trim();
    })
    .join('\n');
  return result;
}

module.exports = {
  prompter: (cz, commit) => {
    cz.prompt([
      {
        type: 'input',
        name: 'issue',
        message: 'Issue number (optional):\n',
      },
      {
        type: 'input',
        name: 'subject',
        message: 'Short description of the change:\n',
      },
      {
        type: 'input',
        name: 'body',
        message: 'Details:\n',
      },
    ]).then(answers => {
      const maxLineWidth = 80;

      let ref = '';
      if (answers.issue.trim().length > 0) {
        ref = `[refs #${answers.issue.trim()}] `;
      }

      const subject = `${ref}${answers.subject}`.slice(0, maxLineWidth);
      const body = wrap(answers.body.trim(), maxLineWidth);

      commit(`${subject}\n\n${body}`.trim());
    });
  },
};
