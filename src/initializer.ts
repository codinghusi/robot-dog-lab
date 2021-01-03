

export class Initializer {
    promises: Promise<any>[] = [];

    constructor() { }

    add() {
        const process = new InitProcess();
        this.promises.push(process.check());
        return process;
    }

    ready() {
        return Promise.all(this.promises);
    }
}

export class InitProcess {
    private promise: Promise<void>;
    finish: () => void;

    constructor() {
        const self = this;
        this.promise = new Promise<void>((resolve, reject) => {
            self.finish = resolve;
        });
    }

    check() {
        return this.promise;
    }
}