+++
Title = "Chessboard from scratch in HTML/CSS"
Date = "2023-01-16T01:22:20-0800"
Author = "Paige"
Description = "A chess UI that I made (needs a chess backend still)"
cover = "img/og.png"
tags = ["HTML/CSS Testing", "CSS", "Javascript"]
+++

# Backend 
The one I want to use is a bit [involved](https://github.com/nmrugg/stockfish.js/) to setup, but maybe at some point.

## The Board

<style> 

.board {
  min-width: 832px;
}

.board-row {
  padding: 0;
  margin: 0;
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px; 
  padding-bottom: 0px;
}

.square {
  display: flex;
  align-items: center;
  font-size: 72px;
  min-width: 72px;
  min-height: 88px;
  float: left;
}

.white-even {
  color: white;
  text-shadow: -4px -4px 8px darkgray;
  background: linear-gradient(135deg, lightgray 0%, #f5f7fa 75%);
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
  padding-left: 32px;
  padding-right: 0px;
  padding-top: 0px; 
  padding-bottom: 0px;
}

.white-odd {
  color: white;
  text-shadow: 2px 2px 4px darkgray;
  background: linear-gradient(109.6deg, rgba(0, 0, 0, 0.93) 11.2%, rgb(63, 61, 61) 78.9%);
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
  padding-left: 32px;
  padding-right: 0px;
  padding-top: 0px; 
  padding-bottom: 0px;
}

.black-even {
  color: black;
  text-shadow: -4px -2px 1px darkgray;
  background: linear-gradient(135deg, lightgray 0%, #f5f7fa 75%);
  cursor: pointer;
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
  padding-left: 32px;
  padding-right: 0px;
  padding-top: 0px; 
  padding-bottom: 0px;
}

.black-odd {
  color: black;
  text-shadow: 1px -1px 1px white;
  background: linear-gradient(109.6deg, rgba(0, 0, 0, 0.93) 11.2%, rgb(63, 61, 61) 78.9%);
  cursor: default;
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
  padding-left: 32px;
  padding-right: 0px;
  padding-top: 0px; 
  padding-bottom: 0px;
}
</style>

<script src="/stockfish/stockfish.js"></script>

  <div class="board">
    <div class="board-row">
      <div class="square black-even">
        ♜
      </div>
      <div class="square black-odd">
        ♞
      </div>
      <div class="square black-even">
        ♝
      </div>
      <div class="square black-odd">
        ♛
      </div>
      <div class="square black-even">
        ♚
      </div>
      <div class="square black-odd">
        ♝
      </div>
      <div class="square black-even">
        ♞
      </div>
      <div class="square black-odd">
        ♜
      </div>
    </div>
    <div class="board-row">
      <div class="square black-odd">
        ♟
      </div>
      <div class="square black-even">
        ♟
      </div>
      <div class="square black-odd">
        ♟
      </div>
      <div class="square black-even">
        ♟
      </div>
      <div class="square black-odd">
        ♟
      </div>
      <div class="square black-even">
        ♟
      </div>
      <div class="square black-odd">
        ♟
      </div>
      <div class="square black-even">
        ♟
      </div>
    </div>
    <div class="board-row">
      <div class="square white-even">
      </div>
      <div class="square white-odd">
      </div>
      <div class="square white-even">
      </div>
      <div class="square white-odd">
      </div>
      <div class="square white-even">
      </div>
      <div class="square white-odd">
      </div>
      <div class="square white-even">
      </div>
      <div class="square white-odd">
      </div>
    </div>
    <div class="board-row">
      <div class="square white-odd">
      </div>
      <div class="square white-even">
      </div>
      <div class="square white-odd">
      </div>
      <div class="square white-even">
      </div>
      <div class="square white-odd">
      </div>
      <div class="square white-even">
      </div>
      <div class="square white-odd">
      </div>
      <div class="square white-even">
      </div>
    </div>
    <div class="board-row">
      <div class="square white-even">
      </div>
      <div class="square white-odd">
      </div>
      <div class="square white-even">
      </div>
      <div class="square white-odd">
      </div>
      <div class="square white-even">
      </div>
      <div class="square white-odd">
      </div>
      <div class="square white-even">
      </div>
      <div class="square white-odd">
      </div>
    </div>
    <div class="board-row">
      <div class="square white-odd">
      </div>
      <div class="square white-even">
      </div>
      <div class="square white-odd">
      </div>
      <div class="square white-even">
      </div>
      <div class="square white-odd">
      </div>
      <div class="square white-even">
      </div>
      <div class="square white-odd">
      </div>
      <div class="square white-even">
      </div>
    </div>
    <div class="board-row">
      <div class="square white-even">
        ♙
      </div>
      <div class="square white-odd">
        ♙
      </div>
      <div class="square white-even">
        ♙
      </div>
      <div class="square white-odd">
        ♙
      </div>
      <div class="square white-even">
        ♙
      </div>
      <div class="square white-odd">
        ♙
      </div>
      <div class="square white-even">
        ♙
      </div>
      <div class="square white-odd">
        ♙
      </div>
    </div>
    <div class="board-row">
      <div class="square white-odd">
        ♖
      </div>
      <div class="square white-even">
        ♘
      </div>
      <div class="square white-odd">
        ♗
      </div>
      <div class="square white-even">
        ♕
      </div>
      <div class="square white-odd">
        ♔
      </div>
      <div class="square white-even">
        ♗
      </div>
      <div class="square white-odd">
        ♘
      </div>
      <div class="square white-even">
        ♖
      </div>
    </div>
  </div>
