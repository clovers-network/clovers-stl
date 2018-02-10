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
    reversi.isSymmetrical()

    reversi.makeVisualBoard().map((r) => {
      console.log(r.join(' '))
    })
    console.log('\n\n')
    console.log(colors.yellow('⚙  Building jscad...'))
    console.log(colors.yellow('☑️  Completed jscad'))
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
              
              let winner = reversi.whiteScore === reversi.blackScore ? reversi.EMPTY : (reversi.whiteScore > reversi.blackScore ? reversi.BLACK : reversi.WHITE)
              // console.log(colors.gray('white has ' + reversi.whiteScore))
              // console.log(colors.gray('black has ' + reversi.blackScore))
              // console.log(colors.gray('winner is ' + winner))
              if (winner === reversi.EMPTY) {
                let file1 = template.replace(new RegExp('__WINNER__', 'g'), reversi.WHITE)
                let done1 = false
                let file1name = './assets/jscad/W-' + moves + '.jscad'
                fs.writeFile(file1name, file1, function (err, resp) {
                  if (err) {
                    reject(err)
                  } else {
                    let stlFile1name = file1name.replace(new RegExp('jscad', 'g'), 'stl')
                    console.log(colors.yellow('⚙  Building STL 1/2...'))
                    shell.exec('openjscad ' + file1name + ' -of stlb -o ' + stlFile1name, {silent: true})
                    console.log(colors.yellow('☑️  Completed STL'))
                    if (done2) {
                      resolve()
                    } else {
                      done1 = true
                    }
                  }
                })
                let done2 = false
                let file2 = template.replace(new RegExp('__WINNER__', 'g'), reversi.BLACK)
                let file2name = './assets/jscad/B-' + moves + '.jscad'
                fs.writeFile(file2name, file2, function (err, resp) {
                  if (err) {
                    reject(err)
                  } else {
                    let stlFile2name = file2name.replace(new RegExp('jscad', 'g'), 'stl')
                    console.log(colors.yellow('⚙  Building STL 2/2...'))
                    shell.exec('openjscad ' + file2name + ' -of stlb -o ' + stlFile2name, {silent: true})
                    console.log(colors.yellow('☑️  Completed STL'))
                    if (done1) {
                      resolve()
                    } else {
                      done2 = true
                    }
                  }
                })
              } else {
                let file = template.replace(new RegExp('__WINNER__', 'g'), winner)
                let filename = './assets/jscad/' + (winner === reversi.WHITE ? 'W-' : 'B-') + moves + '.jscad'
                fs.writeFile(filename, file, function (err, resp) {
                  if (err) {
                    reject(err)
                  } else {
                    let stlFilename = filename.replace(new RegExp('jscad', 'g'), 'stl')
                    console.log(colors.yellow('⚙  Building STL...'))
                    shell.exec('openjscad ' + filename + ' -of stlb -o ' + stlFilename, {silent: true})
                    console.log(colors.yellow('☑️  Completed STL'))
                    resolve()
                  }
                })
              }
            }
          })
        })
        console.log(colors.green('🎉  All Done'))
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('./assets/template.jscad doesn\'t exist')
    }
    // spinner.stop()


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