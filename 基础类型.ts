
//布尔值
let isDone: boolean = false;
isDone=null
isDone=undefined

//数字(支持十进制和十六进制字面量，还支持ES6中引入的二进制和八进制字面量。)
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
decLiteral=null
decLiteral=undefined

//字符串
let names: string = "bob";
names=null
names=undefined
// I'll be ${ names + 1 } years old next month.`;

//数组
let list1: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3];
list1=null
list1=undefined

//元组 Tuple 元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ['hello', 10]; // OK
// Initialize it incorrectly
x = [10, 'hello']; // Error
x=null
x=undefined

//当访问一个已知索引的元素，会得到正确的类型：
console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'


//当访问一个越界的元素，会使用联合类型替代：
x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型

console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString


x[6] = true; // Error, 布尔不是(string | number)类型

//枚举
enum Color {Red = 1, Green = 2, Blue = 4}
let c: Color = Color.Green;
c=null
c=undefined

//Any 我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean

let list2: any[] = [1, true, "free"];

list[1] = 100;


//Void   声明一个void类型的变量没有什么大用，因为你只能为它赋予undefined和null：

let unusable: void = undefined;


//Null 和 Undefined

let u: undefined = undefined;
let n: null = null;

//Never  类型表示的是那些永不存在的值的类型。
// 没有类型是never的子类型或可以赋值给never类型（除了never本身之外）。 即使 any也不可以赋值给never。

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
    }
}

//Object
//declare声明函数或者变量 定义类型时才可用
//这里的void是返回值
declare function create(o: object | null): void ;
 function create(o: object | null): void {console.log(666)};

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error

let obj1:object={}
obj1=null
obj1=undefined


//类型断言
//类型断言（Type Assertion）可以用来手动指定一个值的类型。
// 类型断言不是类型转换，断言成一个联合类型中不存在的类型是不允许的：

//1.
let someValue1: any = "this is a string";

let strLength1: number = (<string>someValue1).length;

//2.
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;

//3.一次断不能改用双重断言
let someValue2: object = {};
let strLength2: string = JSON.stringify(someValue2 as any as HTMLElement);

 /** *///高级类型 /** */
//这里可以用 和， 或，  其中一个  这些高级方法
 // &， |，  instanceof

 //注意：

 // 这样不会报错
let num: number = undefined;


//内联类型注解

let inlineName: {
  first: string;
  second: string;
}

inlineName = {
  first: 'John',
  second: 'Doe'
}

inlineName = {
  // Error: 'Second is the wrong type'
  first: 'John',
  second: 1337
}
