#!/usr/bin/env node
var commander = require('commander')
var shell = require('shelljs')
var fs = require('fs')
var colors = require('colors')
var Reversi = require('../lib/reversi.js')

commander
    .version('0.0.1')

commander
.command('* <moves>')
.description('Generate STL from game moves')
.action(async (moves) => {
  let reversi = new Reversi()
  reversi.playGameMovesString(moves)
  console.log(reversi.rowBoard)

    if (fs.existsSync('./assets/template.jscad')) {
      try {
        await new Promise((resolve, reject) => {
          fs.readFile('./assets/template.jscad', 'utf8', function(err, template) {
            if (err) {
              reject(err)
            } else {
              let printed = '[' + reversi.rowBoard.map((r) => {
                return '\n  ['+ r.join(',') + ']'
              }).join(',') + '\n]'

              template = template.replace(new RegExp('__BOARD__', 'g'), printed)
              
              let winner = reversi.whiteScore === reversi.whiteScore ? reversi.EMPTY : (reversi.whiteScore > reversi.blackScore ? reversi.WHITE : reversi.BLACK)
              
              if (winner === reversi.EMPTY) {
                let file1 = template.replace(new RegExp('__WINNER__', 'g'), reversi.WHITE)
                let done1 = false
                fs.writeFile('./assets/jscad/W-' + moves + '.jscad', file1, function (err, resp) {
                  if (err) {
                    reject(err)
                  } else {
                    if (done2) {
                      resolve()
                    } else {
                      done1 = true
                    }
                  }
                })
                let done2 = false
                let file2 = template.replace(new RegExp('__WINNER__', 'g'), reversi.BLACK)
                fs.writeFile('./assets/jscad/B-' + moves + '.jscad', file2, function (err, resp) {
                  if (err) {
                    reject(err)
                  } else {
                    if (done1) {
                      resolve()
                    } else {
                      done2 = true
                    }
                  }
                })
              } else {
                let file = template.replace(new RegExp('__WINNER__', 'g'), winner)
                fs.writeFile('./assets/jscad/' + (winner === reversi.WHITE ? 'W-' : 'B-') + moves + '.jscad', file, function (err, resp) {
                  if (err) {
                    reject(err)
                  } else {
                    console.log(resp)
                    resolve()
                  }
                })
              }
            }
          })
        })



      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('./assets/template.jscad doesn\'t exist')
    }


  // reversi.makeVisualBoard().map((r) => {
  //   console.log(r.join(' '))
  // })
  // console.log(colors.grey(`
  //   ❎  ❎  ❎  ❎  ❎  ❎  ❎  ❎
  //   ❎  ❎  ❎  ❎  ❎  ❎  ❎  ❎
  //   ❎  ❎  ❎  ❎  ❎  ❎  ❎  ❎
  //   ❎  ❎  ❎  ⚪  🌚  ❎  ❎  ❎
  //   ❎  ❎  ❎  🌚  ⚪  ❎  ❎  ❎
  //   ❎  ❎  ❎  ❎  ❎  ❎  ❎  ❎
  //   ❎  ❎  ❎  ❎  ❎  ❎  ❎  ❎
  //   ❎  ❎  ❎  ❎  ❎  ❎  ❎  ❎
  //   `)
  // )
  process.exit(1);
})


if (process.argv === 0) {
  commander.help()
  process.exit(1)
}

commander.parse(process.argv)