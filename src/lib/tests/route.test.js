import route from "../route";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

describe("route tests", () => {
  it("should only parse path if string", () => {
    const pathObj = {};
    expect(route(pathObj)).toMatchObject(pathObj);

    const pathStr = "/path/:param1";
    expect(route(pathStr)).toEqual(/\/path\/[^\/]+/);
  });

  it("should replace params in the path", () => {
    const mock = new MockAdapter(axios);
    const path = "/path/:param1";
    const url = "/path/43";

    mock.onGet(route(path)).reply(request => {
      expect(request.url).toEqual(url);
      return [200, request];
    });

    expect(axios.get(url)).resolves.toEqual(
      expect.objectContaining({ status: 200 })
    );
  });

  it("should set the wildcards as request params", () => {
    const mock = new MockAdapter(axios);
    const path = "/path/:param1/:param2";
    const url = "/path/43/title";

    mock.onGet(route(path)).reply(request => {
      expect(request.params).toEqual(
        expect.objectContaining({ param1: 43, param2: "title" })
      );

      return [200];
    });

    expect(axios.get(url)).resolves.toEqual(
      expect.objectContaining({ status: 200 })
    );
  });
});