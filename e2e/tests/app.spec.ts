//@ts-ignore

const jestExpect = require("expect");

describe("Activit Feed", () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: { camera: "YES", microphone: "YES", photos: "YES" },
    });
  });

  xit("Fail canary - if this test passes we have issues", async () => {
    jestExpect(false).to.equal(true);
  });

  describe("Like Tests", () => {
    beforeEach(async () => {
      await device.reloadReactNative(); // Reset state at the start of tests
      await waitFor(element(by.id(`0/likeCounter`)))
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

    // Would be better to do with a mock so the post starts in a liked state; however, mocks cannot be run per it block in detox
    it('should decrement the Like count when the Like button is pressed on a Liked post', async () => {
      let attributes = await element(by.id("0/likeCounter")).getAttributes();
      const preTapLikeCount = parseFloat(attributes.text.split(" ")[0]);
      await element(by.id("0/likeButton")).tap();
      attributes = await element(by.id("0/likeCounter")).getAttributes();
      const firstTapLikeCount = parseFloat(attributes.text.split(" ")[0]);
      jestExpect(firstTapLikeCount).toBe(preTapLikeCount + 1); // Check that the like count was incremented to pevent pass on no action
      await element(by.id("0/likeButton")).tap();
      attributes = await element(by.id("0/likeCounter")).getAttributes();
      const secondTapLikeCount = parseFloat(attributes.text.split(" ")[0]);
      jestExpect(preTapLikeCount).toBe(secondTapLikeCount);
    })

    it("should increment the Like count when the Post is double tapped", async () => {
      let attributes = await element(by.id("0/likeCounter")).getAttributes();
      const preTapLikeCount = parseFloat(attributes.text.split(" ")[0]);
      await element(by.id("0/mainPostContent")).multiTap(2);
      attributes = await element(by.id("0/likeCounter")).getAttributes();
      const postTapLikeCount = parseFloat(attributes.text.split(" ")[0]);
      jestExpect(postTapLikeCount).toBe(preTapLikeCount + 1);
    });
  });

  xdescribe("Story Tests", () => {
    beforeEach(async () => {
      await device.reloadReactNative();
      await waitFor(element(by.text("Cheppard")))
      .toBeVisible()
      .withTimeout(5000);
    });

    xit("Should load correct story for tapped user", async () => {
      await element(by.text("Cheppard")).tap();
      await waitFor(element(by.text("Cheppard"))).toBeVisible().withTimeout(5000);
      // TODO Check Story Poster Name - Should Fail
    });
  });

  xdescribe("Comments Tests", () => { 
    xit("should be able to comment on a post", () => {

    });
  });
});
