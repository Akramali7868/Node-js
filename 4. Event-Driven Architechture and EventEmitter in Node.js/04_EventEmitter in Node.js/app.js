import EventEmitter from "events";

const emitter = new EventEmitter();

emitter.setMaxListeners(2)

emitter.on("abc", () => {
    console.log('abc event fired 1');
});
emitter.on("x", () => {
    console.log('x event fired x');
});
emitter.once("abc", () => {
    console.log('abc event fired y');
});

emitter.emit('abc')