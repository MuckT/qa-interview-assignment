//@ts-ignore

const jestExpect = require("expect");

describe("Example", () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: { camera: "YES", microphone: "YES", photos: "YES" },
    });
  });

  describe("Like Button Tests", () => {
    beforeEach(async () => {
      await device.reloadReactNative(); // Reset state at the start of tests
      await waitFor(element(by.id("0/likeCounter")))
      .toBeVisible()
      .withTimeout(5000);
    });

    it("should show the Like count of 66 by defualt", async () => {
      let attributes = await element(by.id("0/likeCounter")).getAttributes();
      const likeCount = parseFloat(attributes.text.split(" ")[0]);
      jestExpect(likeCount).toBe(66); // Starting value is 66
    });

    it("should increment the Like count when the Like button is pressed", async () => {
      let attributes = await element(by.id("0/likeCounter")).getAttributes();
      const preTapLikeCount = parseFloat(attributes.text.split(" ")[0]);
      await element(by.id("0/likeButton")).tap();
      attributes = await element(by.id("0/likeCounter")).getAttributes();
      const postTapLikeCount = parseFloat(attributes.text.split(" ")[0]);
      jestExpect(postTapLikeCount).toBe(preTapLikeCount + 1);
    });

   it("Should increment the Like count when the Post is double tapped", async () => {
      let attributes = await element(by.id("0/likeCounter")).getAttributes();
      const preTapLikeCount = parseFloat(attributes.text.split(" ")[0]);
      await element(by.id("0/mainPostContent")).multiTap(2);
      attributes = await element(by.id("0/likeCounter")).getAttributes();
      const postTapLikeCount = parseFloat(attributes.text.split(" ")[0]);
      jestExpect(postTapLikeCount).toBe(preTapLikeCount + 1);
    });
  });
});
