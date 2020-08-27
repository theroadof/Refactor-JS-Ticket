const test = require('ava');
const {statement,htmlStatement} = require('../src/statement');

const plays = {
    'hamlet': {
        'name': 'Hamlet',
        'type': 'tragedy',
    },
    'as-like': {
        'name': 'As You Like It',
        'type': 'comedy',
    },
    'othello': {
        'name': 'Othello',
        'type': 'tragedy',
    },
};

test('BigCo has three performance' +
    'hamlet has 55 audience\n' +
    'as-like has 35 audience\n' +
    'othello has 40 audience', t => {
    //given
    const invoice = {
        'customer': 'BigCo',
        'performances': [
            {
                'playID': 'hamlet',
                'audience': 55,
            },
            {
                'playID': 'as-like',
                'audience': 35,
            },
            {
                'playID': 'othello',
                'audience': 40,
            },
        ],
    };

    const result = statement(invoice, plays);

    t.is(result, 'Statement for BigCo\n' +
        ' Hamlet: $650.00 (55 seats)\n' +
        ' As You Like It: $580.00 (35 seats)\n' +
        ' Othello: $500.00 (40 seats)\n' +
        'Amount owed is $1,730.00\n' +
        'You earned 47 credits \n');
});

test('BigCo without performances', t => {
    const invoice = {
        'customer': 'BigCo',
        'performances': [],
    };

    const result = statement(invoice, plays);

    t.is(result, 'Statement for BigCo\n'+
    'Amount owed is $0.00\n'+
    'You earned 0 credits \n');
});

test('BigCo hamlet 30 audience',t=>{
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 30,
      }
    ],
  };

  const result = statement(invoice, plays);

  t.is(result, 'Statement for BigCo\n'+
      ' Hamlet: $400.00 (30 seats)\n'+
      'Amount owed is $400.00\n'+
      'You earned 0 credits \n');
});

test('BigCo hamlet 31 audience',t=>{
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 31,
      }
    ],
  };

  const result = statement(invoice, plays);

  t.is(result, 'Statement for BigCo\n'+
      ' Hamlet: $410.00 (31 seats)\n'+
      'Amount owed is $410.00\n'+
      'You earned 1 credits \n');
});

test('BigCo as-like 20 audience',t=>{
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 20,
      }
    ],
  };

  const result = statement(invoice, plays);

  t.is(result, 'Statement for BigCo\n'+
      ' As You Like It: $360.00 (20 seats)\n'+
      'Amount owed is $360.00\n'+
      'You earned 4 credits \n');
});

test('BigCo as-like 21 audience',t=>{
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 21,
      }
    ],
  };

  const result = statement(invoice, plays);

  t.is(result, 'Statement for BigCo\n'+
      ' As You Like It: $468.00 (21 seats)\n'+
      'Amount owed is $468.00\n'+
      'You earned 4 credits \n');
});

test('BigCo unknown type error',t=>{
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'test',
        'audience': 20,
      }
    ],
  };

  const plays = {
    'test': {
      'name': 'Test',
      'type': 'test',
    }
  };

  try {
    const result = statement(invoice, plays);
    t.fail();
  }catch (e) {
    t.is(e.message, 'unknown type: test');
  }
});

test('BigCo has three performance' +
    'hamlet has 55 audience\n' +
    'as-like has 35 audience\n' +
    'othello has 40 audience\n'+
    'print to html format', t => {
    //given
    const invoice = {
        'customer': 'BigCo',
        'performances': [
            {
                'playID': 'hamlet',
                'audience': 55,
            },
            {
                'playID': 'as-like',
                'audience': 35,
            },
            {
                'playID': 'othello',
                'audience': 40,
            },
        ],
    };

    const result = htmlStatement(invoice, plays);

    t.is(result, '<h1>Statement for BigCo</h1>\n' +
        '<table>\n' +
        '<tr><th>play</th><th>seats</th><th>cost</th></tr>' +
        ' <tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>\n' +
        ' <tr><td>As You Like It</td><td>35</td><td>$580.00</td></tr>\n' +
        ' <tr><td>Othello</td><td>40</td><td>$500.00</td></tr>\n' +
        '</table>\n' +
        '<p>Amount owed is <em>$1,730.00</em></p>\n' +
        '<p>You earned <em>47</em> credits</p>\n');
});
