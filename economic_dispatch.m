clear all;
close all;
clc;
n=input("Enter the number of generating units:");
sum1=0;
for i=1:n     % Loop from 1st to n generator unit to get input data
    fprintf("Enter the upper limit of gen %d",i);
    p_up(i)=input(" ");   % Upper generator limit in MW
    fprintf("Enter the lower limit of gen %d",i);
    p_lw(i)=input(" ");   % Lower generator limit in MW
    % Generator cost function of the form a + b*Pg + c*Pg^2
    % a,b,c the constants of generator cost function are given as input
    a(i)=input("Enter a{i]");
    b(i)=input("Enter b[i]");
    c(i)=input("Enter c[i]");
    sum1 = sum1 + inv(2*c(i));    % used to calculate delta lambda
end
% Load Demand input in MW
p_load = input('Enter the load demand');
lamda = 6;   % Try to use random function to generate lamda value in the range from 1 to 10.
del_p = 1;   % Difference between the total generation and total demand
iter=0;
while(del_p>1e-2)
    sum=0;  % Store the sum of total generated power from generators
    for i=1:n
        pg(i)= (lamda-b(i))/(2*c(i)); % Calculation generation power
        sum = sum + pg(i);
    end
    del_p=p_load-sum;  % Used as an stopping parameter in while loop
    del_lambda = del_p/sum1;
    lamda = lamda + del_lambda;
    del_p=del_p;
end
del_p2=1;
iter=1;
while(del_p2>0.01)
    sum=0;
    sum2=sum1;
    for i=1:n
        if pg(i)>=p_up(i)
            pg(i)=p_up(i);
            sum2 = sum2 - inv(2*c(i));
        end
        if pg(i)<=p_lw(i)
           pg(i)=p_lw(i);
           sum2=sum2-inv(2*c(i));
        end
        if p_lw(i)<pg(i) && pg(i)<p_up(i)
            pg(i)= (lamda-b(i))/(2*c(i)); % Calculation generation power
        end 
    sum=sum+pg(i);
    end
    del_p2=p_load-sum;  % Used as an stopping parameter in while loop
    del_lambda = del_p2/sum2;
    lamda = lamda + del_lambda;
    iter=iter+1;
end
% Calculating cost for each generators
for i=1:n
    c(i)=a(i)+(pg(i)*b(i))+(c(i)*((pg(i))^2));
end
disp(pg);
disp(c);