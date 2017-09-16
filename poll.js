var bot = process.DiscordBot;
var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijlmnopqrstuvwxyz0123456789-_";
var p = require("./polls.json");
var currentID = "";
function pollCheck(m, uID, cID) {
	console.log(m[0]);
	switch (m[0]) {
    case 'create':
    case 'make':
      m.shift();
      createPoll(m, uID, cID);
      break;
    case 'v':
    case 'vote':
      m.shift();
      voteOnPoll(m, uID, cID);
      break;
    case 'view':
      m.shift();
      viewPoll(m, cID);
      break;
    default:
      // Don't do anything
      break;
  }
}
function generateID() {

   var idText = "";
   for(i = 0; i < 5; i++) {
     var j = bot.random(b64.length);
     idText += b64[j];
   }
  return idText;
}

function createPoll(msg, uI, cI) {
  mesg = msg.join(" ");
  var pID = generateID();
  currentID = pID;
  console.log(bot.colors.cyan("pID: " + pID));
  var msgText = "";
  var arr = mesg.split(" | ");
  var qstn = arr[0];
  console.log
  arr.shift();
  var opts = arr;
  console.log(bot.colors.yellow("New Poll Before: "));
  console.log(p.polls[pID]);

  var tCount = new Array(opts.length);
  for(var i = 0; i < tCount.length; i++) {
    tCount[i] = 0;
  }
  p.polls[pID] = {
    voted: [],
    options: opts,
    counts: tCount,
    question: qstn
  }
  console.log(bot.colors.yellow("New Poll After: "));
  console.log(p.polls[pID]);
  msgText = "Id: `" + pID + "`\n";
  msgText += "Question: " + qstn + "\n";
  msgText += "Options: " + opts + "\n";
  bot.sendMessages(cI, [msgText])

  bot.fs.writeFileSync('./polls.json', JSON.stringify(p, null, ' '));
}

function voteOnPoll(msg, uI, cI) {
  console.log(p);
  // 0) Get associated variables needed
  var mesg = msg.join(' ');
  var msg = mesg.split(' | ');
	console.log(msg);
  var pID = "";
  if(msg.length > 1) {
    pID = msg[0];
		currentID = pID;
  } else {
    pID = currentID;
  }
  console.log("pID: " + pID);
  msg.shift();
  var opt = msg.join(' ');
  console.log("opt: " + opt);
  var user = resolveID(uI);
  console.log("uI: " + uI);

  // 1) get the poll id and object associated
  if(p.polls.hasOwnProperty(pID)) {
    // set set current poll using the pID
    var pol = p.polls[pID];
    console.log(bot.colors.yellow("Poll:"));
    console.log(pol);

    // Check if user voted in the poll already
    if(pol.voted.indexOf(user) != -1) {
      bot.sendMessages(cI, ["<@"+uI + "> You have already voted!"]);
    } else {
      if(pol.options.indexOf(opt) != -1) {
        pol.voted.push(user);
        var countID = pol.options.indexOf(opt);
        pol.counts[countID] += 1;
        bot.sendMessages(cI, ["<@"+ user +"> has voted for: " + opt]);
      } else {
        bot.sendMessages(cI, ["That is not an option sadly"]);
      }
    }
  } else {
    bot.sendMessages(cI, ["That ID doesn't exist yet."]);
  }
  // Get index of option selected to add to the respective count index
  bot.fs.writeFileSync('./polls.json', JSON.stringify(p, null, ' '));
}

function viewPoll(msg, cI) {
  console.log(p);
  var pID = "";
  // 0) Get associated variables needed
  if(msg.length == 0) {
    pID = currentID;
  }
   else {
     pID = msg[0];
     currentID = pID;
   }
  // 1) get the poll id and object associated
  if(p.polls.hasOwnProperty(pID)) {
    // set set current poll using the pID
    var pol = p.polls[pID];
    console.log(bot.colors.yellow("Poll:"));
    console.log(pol);
    var msgText = "";
    var sum = 0;
    for(var c = 0; c < pol.counts.length; c++) {
      sum += pol.counts[c];
    }

    msgText = "Id: `" + pID + "`\n";
    msgText += "Question: " + pol.question + "\n";
    msgText += "Results: \n```"
    var percent = 0;
    var tally = 0;
    for(var i = 0; i < pol.counts.length; i++) {
      tally = pol.counts[i];
      percent = Math.round((tally/sum)*10000)/100;
      msgText += (pol.options[i] + " - " + tally + " (" + percent + "%)\n");
    }
    msgText += "```";
    bot.sendMessages(cI, [msgText]);
  } else {
    bot.sendMessages(cI, ["Poll ID doesn't exist!"]);
  }
}

function resolveID(mention) {
	mention = mention.toString();
	uID = mention.replace(/\D/g, "");
	return uID;
}


var pollFunctions = {
	pollCheck: pollCheck
}
module.exports = pollFunctions;
