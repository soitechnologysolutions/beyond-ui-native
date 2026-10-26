import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("Data Table & List Algorithms", () => {
  const sampleData = [
    { id: "1", name: "Alpha", amount: 150, status: "completed" },
    { id: "2", name: "Beta", amount: 80, status: "pending" },
    { id: "3", name: "Gamma", amount: 220, status: "completed" },
    { id: "4", name: "Delta", amount: 50, status: "failed" },
    { id: "5", name: "Epsilon", amount: 310, status: "completed" },
  ];

  test("filters data by search query across multiple keys", () => {
    const query = "bet";
    const filtered = sampleData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(query.toLowerCase())
      )
    );

    assert.equal(filtered.length, 1);
    assert.equal(filtered[0].name, "Beta");
  });

  test("sorts numerical columns ascending and descending", () => {
    const sortedAsc = [...sampleData].sort((a, b) => a.amount - b.amount);
    assert.equal(sortedAsc[0].amount, 50);
    assert.equal(sortedAsc[sortedAsc.length - 1].amount, 310);

    const sortedDesc = [...sampleData].sort((a, b) => b.amount - a.amount);
    assert.equal(sortedDesc[0].amount, 310);
    assert.equal(sortedDesc[sortedDesc.length - 1].amount, 50);
  });

  test("sorts alphabetical columns properly", () => {
    const sorted = [...sampleData].sort((a, b) => a.name.localeCompare(b.name));
    assert.equal(sorted[0].name, "Alpha");
    assert.equal(sorted[sorted.length - 1].name, "Gamma");
  });

  test("paginates items according to pageSize and currentPage", () => {
    const pageSize = 2;
    const page1 = sampleData.slice(0, pageSize);
    const page2 = sampleData.slice(pageSize, pageSize * 2);
    const page3 = sampleData.slice(pageSize * 2, pageSize * 3);

    assert.equal(page1.length, 2);
    assert.equal(page2.length, 2);
    assert.equal(page3.length, 1);
    assert.equal(page1[0].id, "1");
    assert.equal(page2[0].id, "3");
    assert.equal(page3[0].id, "5");
  });
});
