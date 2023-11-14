"use strict";

var rows = 9;
var column = 9;
var div = 3;

var numbers = Array(9);

for(var i = 0; i !== 9; i++)
  {
    numbers[i] = Array(9);
    for(var ii = 0; ii !== 9; ii++)
    {
      numbers[i][ii] = 0;
    }
  }

var allows = {rows:Array(9), columns:Array(9), squares:Array(9)};

var reds = 0;


$(function(){
  Number.isInteger = Number.isInteger || function(value) {
  return typeof value === "number" && 
    isFinite(value) && 
    Math.floor(value) === value;
  };

  for(var i = 0; i !== 9; i++)
  {
    allows.rows[i] = Array(9);
    allows.columns[i] = Array(9);
    allows.squares[i] = Array(9);
    for(var ii = 0; ii !== 9; ii++)
    {
      allows.rows[i][ii] = true;
      allows.columns[i][ii] = true;
      allows.squares[i][ii] = true;
    }
  }
  });

function IDtoX(id)
{
  return ((parseInt(id.substring(1,4))-1)%9);
};

function IDtoY(id)
{
  return Math.floor((parseInt(id.substring(1,4))-1)/9);
};

function XYtoID(X, Y)
{
  return "n" + (X + Y*9 + 1);
}

function intdiv(a, b)
{
   return Math.floor(a/b);
}

function XYtoSquares(X, Y)
{
   return allows.squares[intdiv(X, 3)+ intdiv(Y, 3)*3];
   
}

function XYtoRows(X, Y)
{
  return allows.rows[Y];
}

function XYtoColumn(X, Y)
{
  return allows.columns[X];
}

function XYNtoIsAllowed(X, Y, N)
{
  return N===0 || XYtoSquares(X,Y)[N-1] && XYtoRows(X,Y)[N-1] && XYtoColumn(X,Y)[N-1];
}

function XYNtoApply(X, Y, N)
{
  if(numbers[X][Y] !== 0)
  {
    XYtoSquares(X,Y)[numbers[X][Y] -1] = true;
    XYtoRows(X,Y)[numbers[X][Y] -1] = true;
    XYtoColumn(X,Y)[numbers[X][Y] -1] = true;
    
    numbers[X][Y] = 0;
  }
  
  if (N !== 0)
  {
    numbers[X][Y] = N;
    XYtoSquares(X,Y)[N-1] = false;
    XYtoRows(X,Y)[N-1] = false;
    XYtoColumn(X,Y)[N-1] = false;
  }
}

function user_change(event)
{
   if(event.currentTarget.value === "" || Number.isInteger(Number.parseInt(event.currentTarget.value)) === true && 0< Number.parseInt(event.currentTarget.value) && Number.parseInt(event.currentTarget.value)<10)
   {
      var x = IDtoX(event.currentTarget.id);
      var y = IDtoY(event.currentTarget.id);
      var n = Number.parseInt(event.currentTarget.value);
      if(event.currentTarget.value === "")
      {
        n = 0;
      }
      
      if(XYNtoIsAllowed(x,y,n))
      {
        XYNtoApply(x,y,n);
        if($(event.currentTarget).css("border-color") === "rgb(255, 153, 153)")
        {
          $(event.currentTarget).css("border", "2px solid rgb(173, 204, 204)");
          reds--;
        }
      }
      else if($(event.currentTarget).css("border-color") !== "rgb(255, 153, 153)")
      {
        $(event.currentTarget).css("border", "2px solid #ff9999");
        reds++;
      };
      
      
   }
   else
   {
     if($(event.currentTarget).css("border-color") !== "rgb(255, 153, 153)")
     {
      $(event.currentTarget).css("border", "2px solid #ff9999");
      reds++;
     };
   }
}

function invalid_value()
{
  return reds !== 0;
}

function getEvent(X, Y, actual)
{
  return {X:X, Y:Y, reverted: actual};
}

function solve()
{
  if(invalid_value()){
    console.log("Invalid values in input.");
    return;
  }
  
  var change_log = Array(10000);
  var change_log_lenght = 0;
    
  for(var i = 0; i !== 9; i++)
  {
    for(var ii = 0; ii !== 9; ii++)
    {
      
      if(change_log_lenght !== 0 && change_log[change_log_lenght-1].X === i && change_log[change_log_lenght-1].Y === ii)
      {
        var done = false;
        for(var iii = change_log[change_log_lenght-1].reverted; iii !== 9; iii++)
        {
          if(XYNtoIsAllowed(i, ii, iii+1))
          {
            change_log[change_log_lenght - 1] = getEvent(i, ii, iii + 1);
            XYNtoApply(i,ii,iii + 1);
            done = true;
            break;
          }
        }
        
        if(!done)
        {
          if(change_log_lenght === 1)
          {
              console.log("There is no solution.");
              return;
          }
          
          change_log_lenght--;
          XYNtoApply(i,ii,0);
          i = change_log[change_log_lenght-1].X;
          ii = change_log[change_log_lenght-1].Y - 1;
          continue;
        }
        
      }
      
      if(numbers[i][ii] === 0)
      {
        for(var iii = 0; iii !== 9; iii++)
        {
          if(XYNtoIsAllowed(i, ii, iii + 1))
          {
            change_log_lenght++;
            change_log[change_log_lenght - 1] = getEvent(i, ii, iii + 1);
            XYNtoApply(i,ii,iii + 1);
            break;
          }
        }
        
        if(numbers[i][ii] === 0)
        {
          if(change_log_lenght === 0)
          {
              console.log("There is no solution.");
              return;
          }
          
          i = change_log[change_log_lenght-1].X;
          ii = change_log[change_log_lenght-1].Y - 1;
        }
        
      }
     
      
    }
  }
  
  
  
  
  for(var i = 0; i !== 9; i++)
  {
    for(var ii = 0; ii !==9; ii++)
    {
      $("#"+XYtoID(i, ii)).val(numbers[i][ii]);
    }
  }
}




