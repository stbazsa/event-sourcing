const {
  EventProcessor,
  ArrivalEvent,
  DepartureEvent,
  LoadEvent,
  UnLoadEvent,
} = require("./events");
const { Cargo, Port, Ship } = require("./entities");

// Setup
const eProc = new EventProcessor();
const stuff = new Cargo("Packed Stuff");
const kr = new Ship("King Royal");
const sfo = new Port("San Francisco", "US");
const la = new Port("Los Angeles", "US");
const van = new Port("Vancouver", "CA");

test("Arrival event sets ship location", () => {
  eProc.process(new ArrivalEvent(new Date(Date.UTC(2005, 11, 11)), sfo, kr));
  expect(sfo).toEqual(kr.port);
});

test("Departure event puts ship location to sea", () => {
  eProc.process(new ArrivalEvent(new Date(Date.UTC(2005, 11, 1)), sfo, kr));
  eProc.process(new DepartureEvent(new Date(Date.UTC(2005, 11, 1)), sfo, kr));
  expect(kr.port).toBe("At Sea");
});

test("Visiting Canada marks cargo", () => {
  eProc.process(new ArrivalEvent(new Date(Date.UTC(2005, 11, 2)), sfo, kr));
  eProc.process(new LoadEvent(new Date(Date.UTC(2005, 11, 1)), stuff, kr));
  eProc.process(new DepartureEvent(new Date(Date.UTC(2005, 11.3)), sfo, kr));
  eProc.process(new ArrivalEvent(new Date(Date.UTC(2005, 11, 4)), van, kr));
  eProc.process(new DepartureEvent(new Date(Date.UTC(2005, 11.5)), van, kr));
  expect(stuff.hasBeenInCanada).toBeTruthy();
});

test("Cargo coming from Canada gets marked", () => {
  eProc.process(new ArrivalEvent(new Date(Date.UTC(2005, 11, 2)), van, kr));
  eProc.process(new LoadEvent(new Date(Date.UTC(2005, 11, 1)), stuff, kr));
  eProc.process(new DepartureEvent(new Date(Date.UTC(2005, 11.3)), van, kr));
  eProc.process(new ArrivalEvent(new Date(Date.UTC(2005, 11, 4)), sfo, kr));
  expect(stuff.hasBeenInCanada).toBeTruthy();
});
