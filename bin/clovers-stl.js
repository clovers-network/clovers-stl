#!/usr/bin/env node
var commander = require('commander')
var shell = require('shelljs')
var fs = require('fs')
var colors = require('colors')
var Reversi = require('../lib/reversi.js')
var template = require('../assets/template.js')

commander
    .version('0.0.1')
    .option('-x, --complexity [complexity]', 'mesh complexity (default 12)')

commander
.command('* <moves>')
.description('Generate STL from game moves')
.action(async (moves) => {
  try {
    let reversi = new Reversi()
    reversi.playGameMovesString(moves)
    reversi.isSymmetrical()

    let symmetrical = reversi.symmetrical ? 'S' : 'N'

    reversi.makeVisualBoard().map((r) => {
      console.log(r.join(' '))
    })

    let printed = '[' + reversi.rowBoard.map((r) => '\n  ['+ r.join(',') + ']').join(',') + '\n]'
    template = template.replace(new RegExp('__BOARD__', 'g'), printed)

    let fn = commander.complexity || 12
    template = template.replace(new RegExp('__FN__', 'g'), fn)
    
    let winner = reversi.whiteScore === reversi.blackScore ? reversi.EMPTY : (reversi.whiteScore > reversi.blackScore ? reversi.WHITE : reversi.BLACK)
    let winner_ = winner === reversi.WHITE ? 'W' : (winner === reversi.BLACK ? 'B' : 'TIE')
    
    console.log(colors.gray('W (' + reversi.WHITE + '): ' + reversi.whiteScore))
    console.log(colors.gray('B (' + reversi.BLACK + '): ' + reversi.blackScore))
    console.log(colors.gray('Winner: ' + winner_))
    console.log(colors.gray('Symmetrical: ' + (reversi.symmetrical ? 'true' : 'false')))
    console.log(colors.gray('Board: ' + reversi.byteBoard))

    var generate = function (winner, winner_) {
      return new Promise((resolve, reject) => {
        try {
          let path = './stl/'
          if (!fs.existsSync(path)) fs.mkdirSync(path)
          path = './jscad/'
          if (!fs.existsSync(path)) fs.mkdirSync(path)

          let file = template.replace(new RegExp('__WINNER__', 'g'), winner)
          let filename = path + fn + '-' + winner_ + '-' + symmetrical + '-' + reversi.byteBoard + '-' + moves + '.jscad'
          console.log(colors.yellow('⚙  Building jscad ' + winner_))
          fs.writeFile(filename, file, function (err, resp) {
            if (err) {
              reject(err)
            } else {
              console.log(colors.green('☑️  Completed jscad ' + winner_ + ' ' + filename))
              let stlFilename = filename.replace(new RegExp('jscad', 'g'), 'stl')
              console.log(colors.yellow('⚙  Building STL ' + winner_))
              shell.exec('openjscad ' + filename + ' -of stlb -o ' + stlFilename, {silent: true})
              console.log(colors.green('☑️  Completed STL ' + winner_ + ' ' + stlFilename))
              resolve()
            }
          })
        } catch (error) {
          reject(error)
        }
      })
    }

    if (winner === reversi.EMPTY) {
      await generate(reversi.BLACK, 'B')
      await generate(reversi.WHITE, 'W')
    } else {
      await generate(winner, winner_)
    }

    console.log(colors.grey('🎉  All Done 🎉'))
  } catch (error) {
    console.log(error)
  }
  process.exit(1);
})


if (process.argv === 0) {
  commander.help()
  process.exit(1)
}

commander.parse(process.argv)