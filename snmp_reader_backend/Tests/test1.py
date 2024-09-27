import datetime

x = datetime.datetime.now()

test = str(x.year)+"."+str(x.month)+"."+str(x.day)

print(test)

test2 = test.split(".")

print(test2)

y = datetime.datetime(int(test2[0]), int(test2[1]),int(test[2]))

print(y)