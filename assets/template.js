module.exports = `// title      : Clovers Sample
// author     : Billy Rennekamp
// license    : MIT License
// revision   : 0.003
// tags       : clovers.network
// file       : clovers-stl.jscad

var board = __BOARD__
var winner = __WINNER__

function main() {

var fn = __FN__
var fat = __FAT__

let grid = []
board.forEach((r, i) => {
  r.forEach((t, j) => {
    if (t === winner) return
    let ii = (j - 3.5) * 1.5
    let jj = (i - 3.5) * 1.5
    if (t === 3) {
      grid.push(
        sphere({r:0.81, fn: fn, center: true})
        .translate([ii,jj, fat ? 2.45 : 1.425])
        .scale([1,1,0.5])
      )            
      grid.push(
        sphere({r:0.81, fn: fn, center: true})
        .translate([ii,jj, fat ? -2.45 : -1.425])
        .scale([1,1,0.5])
      )
    } else {
      grid.push(
        difference(
          cylinder({fn: fn, r:1.05, h: 5, center: true}).translate([ii,jj]),
          rotate_extrude(
            {fn: fn}, 
            translate(
              [ 1.05, 0 ,0],
              circle({r: .1, fn: fn, center: true})
              .scale([6, fat ? 12 : 6 ,1])
            )
          ).translate([ii,jj])
        )
      )
    }
  })
})

return union(
 difference(
  union(
    rotate_extrude({fn: fn * 2}, translate([8,0,0],circle({r: fat ? 1 : 0.5, fn: fn, center: true}))),
    cylinder({
      r: 8,
      h: fat ? 2 : 1,
      center: true, 
      fn: fn * 2, 
    })
    ),
  ...grid
  )
 ).translate([0,0,1]).scale(5);
}`
