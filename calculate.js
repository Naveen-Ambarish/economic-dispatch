function find_wolves(arr1){
    let arr = [...new Set(arr1)];
    for(var i = 0;i<arr.length;i++){
        arr[i] = [arr[i],i];
    }
    arr = arr.sort(function(x, y){ return x[0] - y[0]; });
    return [arr[0],arr[1],arr[2]];
}

function arr_sum(arr){
    var sum = 0;
    for(var i = 0;i<arr.length;i++){
        sum+=arr[i];
    }
    return sum;
}

function invsum(arr){
    var sum = 0;
    for(var i =0; i<arr.length;i++){
        sum+=1/(2*arr[i]);
    }
    return sum; 
}

function calculate(){
    var number_of_gen = sessionStorage.getItem("numberOfGen");
    var Pmax = []; 
    var Pmin = [];
    var a = [];
    var b = [];
    var c = [];
    var Pload = [];
    Pload = Number(document.getElementById("Pload").value);
    sessionStorage.setItem("Pload",Pload);

    for(var i =0; i<number_of_gen;i++){
        Pmax.push(Number(document.getElementById("Pmax"+i).value));
        Pmin.push(Number(document.getElementById("Pmin"+i).value));
        a.push(Number(document.getElementById("a"+i).value));
        b.push(Number(document.getElementById("b"+i).value));
        c.push(Number(document.getElementById("c"+i).value));
        sessionStorage.setItem("a"+i,a[i]);
        sessionStorage.setItem("b"+i,b[i]);
        sessionStorage.setItem("c"+i,c[i]);
        sessionStorage.setItem("Pmax"+i,Pmax[i]);
        sessionStorage.setItem("Pmin"+i,Pmin[i]);
        
    }
    gwo(number_of_gen,Pmax,Pmin,a,b,c,Pload);
    lambda(number_of_gen,Pmax,Pmin,a,b,c,Pload);
    window.location.href='answer.html';
}

function back1(){
    window.location.href='index.html';
}

function gwo(number_of_gen,Pmax,Pmin,a,b,c,Pload){

    total_pop = 20;
    number_of_iterations = 25;
    
    var mincost = Number.MAX_VALUE;
    var minima = Number.MAX_VALUE;
    
    //Initializing population
    var pop = new Array(total_pop).fill(0).map(() => new Array(number_of_gen).fill(0));
    for(var i =0;i<total_pop;i++){
        curr_total = 0;
        for(var j = 0;j<number_of_gen;j++){
            pop[i][j] = (Pmax[j] - Pmin[j])*Math.random() + Pmin[j];
            curr_total += pop[i][j];
        }
        
        needed_energy = Pload - curr_total;
    
        for(var j = 0;j<number_of_gen;j++){
            pop[i][j]+=needed_energy;
            needed_energy = 0;
            if(pop[i][j]>Pmax[j]){
                needed_energy = pop[i][j]-Pmax[j];
                pop[i][j] = Pmax[j];
            }
    
            if(pop[i][j]<Pmin[j]){
                needed_energy = pop[i][j]-Pmin[j];
                pop[i][j] = Pmin[j];
            }
        }
    }
    var alpha = [Number.MAX_VALUE , 0];
    var beta = [Number.MAX_VALUE , 0];
    var gamma = [Number.MAX_VALUE , 0];
    
    
    //Finding current cost of pops
    var cost = new Array(total_pop).fill(0)
    for(var i = 0;i<total_pop;i++){
        for(var j = 0;j<number_of_gen;j++){
            cost[i]+=(c[j]*pop[i][j]*pop[i][j])+(b[j]*pop[i][j])+a[j];
        }
    }
    //Main GWO loop
    for(var x =0;x<number_of_iterations;x++){
    
        //Find Alpha, Beta and Gamma
        var wolves = find_wolves(cost);
    
        if(wolves[0][0]<alpha[0]){
            alpha = wolves[0];
        }
        if(wolves[1][0]<beta[0]){
            beta = wolves[1];
        }
        if(wolves[2][0]<gamma[0]){
            gamma = wolves[2];
        }
    
        //Updating position and value of minima
        if(alpha[0]<mincost){
            minima = pop[alpha[1]];
            mincost = alpha[0];
        }
    
        
        scale = 2*(1-(x/number_of_iterations));
    
        var x1 = 0;
        var x2 = 0;
        var x3 = 0;
        var temp_pop = new Array(number_of_gen).fill(0);
        var temp_cost = 0;
        for(var i = 0;i<total_pop;i++){
            for( var j=0;j<number_of_gen;j++){
                x1 = pop[alpha[1]][j]-(((2*scale*Math.random())-scale)*Math.abs((2*Math.random()*pop[alpha[1]][j])-pop[i][j]));
                x2 = pop[beta[1]][j]-(((2*scale*Math.random())-scale)*Math.abs((2*Math.random()*pop[beta[1]][j])-pop[i][j]));
                x2 = pop[gamma[1]][j]-(((2*scale*Math.random())-scale)*Math.abs((2*Math.random()*pop[gamma[1]][j])-pop[i][j]));
    
                if(x1>Pmax[j]){
                    x1 = Pmax[j];
                }
                else if(x1<Pmin[j]){
                    x1 = Pmax[j];
                }
    
                if(x2>Pmax[j]){
                    x2 = Pmax[j];
                }
                else if(x2<Pmin[j]){
                    x2 = Pmax[j];
                }
                if(x3>Pmax[j]){
                    x3 = Pmax[j];
                }
                else if(x3<Pmin[j]){
                    x3 = Pmax[j];
                }
    
                temp_pop[j] = (x1+x2+x3)/3;
            }
           
        //Applying generator limits
        var excess = Pload - arr_sum(temp_pop);
        for(var j = 0;j<number_of_gen.length;j++){
            pop[j]+=excess;
            excess = 0;
            if(pop[j]>Pmax[j]){
                excess = pop[j]-Pmax[j];
                pop[j] = Pmax[j];
            }
        
            if(pop[j]<Pmin[j]){
                excess = pop[j]-Pmin[j];
                pop[j] = Pmin[j];
            }
        }
    
        //Updating pops if new calculated position has lower cost
        for(var j = 0;j<number_of_gen;j++){
            temp_cost+=(c[j]*temp_pop[j]*temp_pop[j])+(b[j]*temp_pop[j])+a[j];
        }
        if(temp_cost<cost[i]){
            cost[i] = temp_cost;
            pop[i] = temp_pop;
        }
    }
    }
    
    
    console.log(mincost);
    console.log(minima);
    sessionStorage.setItem("GWOCost",mincost);
    for( var i =0;i<number_of_gen;i++){
        sessionStorage.setItem("GWO"+i,minima[i]);
    }
}

function lambda(number_of_gen,Pmax,Pmin,a,b,c,Pload){
        
    var is = invsum(c);
    var p = new Array(number_of_gen).fill(0)    //initalizing power produced by each generator as 0
    var current_power = 0;                      //initializing total power produced as 0
    var lambda = 0;                             //initializing lambda as 0
    while(Pload-current_power>0.00001){
        for(var i = 0;i<number_of_gen;i++){
            p[i] = (lambda-b[i])/(2*c[i]);

            //making sure generators produce power with limits
            if(p[i]>Pmax[i]){
                p[i] = Pmax[i];
            }
            else if(p[i]<Pmin[i]){
                p[i] = Pmin[i];
            }

        }
        current_power = arr_sum(p);
        lambda +=(Pload-current_power)/is;
    }

    console.log(p);

    //Calculating total cost
    var cost =0;
    for(var j = 0;j<number_of_gen;j++){
        cost+=(c[j]*p[j]*p[j])+(b[j]*p[j])+a[j];
    }
    console.log(cost);
    sessionStorage.setItem("lambdaCost",cost);
    for( var i =0;i<number_of_gen;i++){
        sessionStorage.setItem("lambda"+i,p[i]);
    }
}

