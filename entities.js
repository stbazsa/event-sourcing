const Registry = {
  CustomsNotificationGateway: {
    notify(arrivalEvent) {
      // console.log(`Customs Notification Gateway received: ${arrivalEvent}`);
    },
  },
};

class Cargo {
  #name;
  #hasBeenInCanada;
  #port;
  #priorPort;
  #ship;
  constructor(name) {
    this.#name = name;
    this.#hasBeenInCanada = false;
    this.#port = undefined;
    this.#priorPort = undefined;
    this.#ship = undefined;
  }

  handleArrival(arrivalEvent) {
    if (arrivalEvent.port.countryCode === "CA") this.#hasBeenInCanada = true;
  }

  get name() {
    return this.#name;
  }

  set hasBeenInCanada(value) {
    this.#hasBeenInCanada = value;
  }

  get hasBeenInCanada() {
    return this.#hasBeenInCanada;
  }

  set ship(newShip) {
    this.#ship = newShip;
  }

  set port(newPort) {
    this.#port = newPort;
  }

  set priorPort(newPriorPort) {
    this.#priorPort = newPriorPort;
  }

  log() {
    console.log(
      `Cargo named: '${this.#name}'\nHasBeenInCanada: ${
        this.#hasBeenInCanada
      }\nPort: ${this.#port}\npriorPort: ${this.#priorPort}\nOn ship: ${
        this.#ship?.name
      }`
    );
  }

  static handleLoad(loadEvent) {
    loadEvent.cargo.ship = loadEvent.ship;
    loadEvent.cargo.priorPort = loadEvent.ship.port;
    loadEvent.cargo.port = null;
    if (loadEvent.ship.port.countryCode === "CA")
      loadEvent.cargo.hasBeenInCanada = true;
    Ship.handleLoad(loadEvent);
  }

  static reverseLoad(loadEvent) {
    this.#ship.reverseLoad(loadEvent);
    this.#ship = null;
    this.#port = this.#priorPort;
  }
}

class Port {
  #name;
  #countryCode;

  constructor(name, countryCode) {
    this.#name = name;
    this.#countryCode = countryCode;
  }

  get name() {
    return this.#name;
  }

  get countryCode() {
    return this.#countryCode;
  }
  handleArrival(arrivalEvent) {
    arrivalEvent.ship.port = this;
    Registry.CustomsNotificationGateway.notify(arrivalEvent);
  }
}

class Ship {
  #name;
  #port;
  #cargo;

  constructor(name) {
    this.#name = name;
    this.#port = undefined;
    this.#cargo = [];
  }

  get name() {
    return this.#name;
  }

  get port() {
    return this.#port;
  }

  get cargo() {
    return this.#cargo;
  }

  set port(newPort) {
    this.#port = newPort;
  }

  set cargo(newCargo) {
    this.#cargo = newCargo;
  }

  log() {
    console.log(
      `Ship '${this.#name}' is at port ${this.#port.name}/${
        this.#port.countryCode
      }\nWith ${this.#cargo.length} piece(s) of cargo\n`
    );
  }
  static handleArrival(arrivalEvent) {
    arrivalEvent.ship.port = arrivalEvent.port;
    arrivalEvent.ship.cargo.map((c) => c.handleArrival(arrivalEvent));
    Registry.CustomsNotificationGateway.notify(arrivalEvent);
  }

  static handleDeparture(departureEvent) {
    departureEvent.ship.port = "At Sea";
  }

  static handleLoad(loadEvent) {
    loadEvent.ship.cargo.push(loadEvent.cargo);
  }
}

module.exports = {
  Cargo,
  Port,
  Ship,
};
