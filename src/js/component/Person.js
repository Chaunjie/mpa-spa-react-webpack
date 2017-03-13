/**
 * =====================================
 * Created by Chaunjie on 17/3/10.
 * Used for About component
 * Project Verson 0.0.1
 * =====================================
 */
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    say() {
        return `我是${this.name},我今年${this.age}岁了。`;
    }
}
export default Person;
