// title      : Clovers Sample
// author     : Billy Rennekamp
// license    : MIT License
// revision   : 0.001
// tags       : Clovers, Coin
// file       : clovers-stl.jscad

var board = __BOARD__
var winner = __WINNER__

function main() {

var fn = 48

let grid = []
board.forEach((r, i) => {
  r.forEach((t, j) => {
    if (t !== winner) return
    let ii = (j - 3.5) * 1.5
    let jj = (i - 3.5) * 1.5
    if (t === 3) {
      grid.push(
        sphere({r:0.7, fn: fn, center: true})
        .translate([ii,jj, 1])
        .scale([1,1,0.5])
        )            
      grid.push(
        sphere({r:0.7, fn: fn, center: true})
        .translate([ii,jj, -1])
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
              .scale([6, 6 ,1])
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
    rotate_extrude({fn: fn * 2}, translate([8,0,0],circle({r: 0.5, fn: fn, center: true}))),
    cylinder({
      r: 8,
      h: 1,
      center: true, 
      fn: fn * 2, 
    })
    ),
  ...grid
  )
 ).translate([0,0,1]).scale(5);
}