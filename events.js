const { Cargo, Port, Ship } = require("./entities");

class EventProcessor {
  #logs;
  constructor() {
    this.#logs = [];
  }

  process(domainEvent) {
    domainEvent.process();
    this.#logs.push(domainEvent);
  }

  get logs() {
    return this.#logs;
  }
}

class DomainEvent {
  constructor(occurred) {
    this.occurred = occurred;
    this.recorded = new Date(Date.now()); //TODO: Change date library, use NTP to sync time, store everything in UTC
  }
}

// Ship departed from port
class DepartureEvent extends DomainEvent {
  #port;
  #ship;

  constructor(occured, port, ship) {
    super(occured);
    this.#port = port;
    this.#ship = ship;
  }

  get log() {
    return `DEPARTURE EVENT: Ship '${this.ship.name}' departed from ${
      this.port.name
    } in ${this.port.countryCode} on ${this.occurred.toUTCString()}`;
  }

  get port() {
    return this.#port;
  }

  get ship() {
    return this.#ship;
  }

  process() {
    Ship.handleDeparture(this);
  }
}

// Ship arrived at port
class ArrivalEvent extends DomainEvent {
  #port;
  #ship;

  constructor(occurred, port, ship) {
    super(occurred);
    this.#port = port;
    this.#ship = ship;
  }

  get port() {
    return this.#port;
  }

  get ship() {
    return this.#ship;
  }

  get log() {
    return `ARRIVAl EVENT: Ship '${this.ship.name}' arrived at ${
      this.port.name
    } in ${this.port.countryCode} on ${this.occurred.toUTCString()}`;
  }

  set port(newPort) {
    this.#port = newPort;
  }

  set ship(newShip) {
    this.#ship = newShip;
  }

  process() {
    Ship.handleArrival(this);
  }
}

//Cargo loaded to ship
class LoadEvent extends DomainEvent {
  #cargo;
  #ship;
  #priorPort;

  constructor(occurred, cargo, ship) {
    super(occurred);
    this.#cargo = cargo;
    this.#ship = ship;
    this.#priorPort = ship?.port;
  }

  get ship() {
    return this.#ship;
  }
  get cargo() {
    return this.#cargo;
  }

  log() {
    console.log(
      `LOAD EVENT: Cargo named '${
        this.#cargo?.name
      }' loaded to \n Ship named '${this.#ship?.name}' \n At ${this.occurred}`
    );
  }

  process() {
    Cargo.handleLoad(this);
  }

  reverse() {
    Cargo.reverseLoad(this);
  }
}

// TODO: finish, only copied yet
class UnLoadEvent extends DomainEvent {
  #ship;
  #cargo;
  #priorPort;
  constructor(occurred, cargo, ship) {
    super(occurred);
    this.#ship = ship;
    this.#cargo = cargo;
    this.#priorPort = ship.port;
  }

  get ship() {
    return this.ship;
  }
  get cargo() {
    return this.cargo;
  }

  process() {
    Cargo.handleLoad(this);
  }

  reverse() {
    Cargo.reverseLoad(this);
  }
}

//Cargo undloaded from ship

module.exports = {
  EventProcessor,
  ArrivalEvent,
  DepartureEvent,
  LoadEvent,
  UnLoadEvent,
};
