//@ts-ignore

const jestExpect = require("expect");

// Import Mock Data To Test Against
const mockPosts = [
  {
    "id": 0,
    "likeCount": 66,
    "commentCount": 979,
    "shareCount": 332,
    "author": "Prince Dotson",
    "time": "02:42:03"
  },
  {
    "id": 1,
    "likeCount": 761,
    "commentCount": 84,
    "shareCount": 743,
    "author": "Hicks Melton",
    "time": "12:46:45"
  },
  {
    "id": 3,
    "likeCount": 101,
    "commentCount": 263,
    "shareCount": 804,
    "author": "Wilda Bentley",
    "videoUrl":"",
    "time": "09:44:33"
  },
  {
    "id": 5,
    "likeCount": 190,
    "commentCount": 670,
    "shareCount": 280,
    "author": "Madge Rose",
    "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "time": "02:09:50"
  },
  {
    "id": 6,
    "likeCount": 361,
    "commentCount": 939,
    "shareCount": 392,
    "author": "Suzette Richard",
    "videoUrl":"",
    "time": "08:46:02"
  },
  {
    "id": 7,
    "likeCount": 611,
    "commentCount": 849,
    "shareCount": 613,
    "author": "Miranda Thornton",
    "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "time": "06:00:04"
  },
  {
    "id": 8,
    "likeCount": 267,
    "commentCount": 642,
    "shareCount": 760,
    "author": "Coleen Vazquez",
    "videoUrl":"",
    "time": "03:17:12"
  },
  {
    "id": 9,
    "likeCount": 596,
    "commentCount": 46,
    "shareCount": 477,
    "author": "Ella Hood",
    "videoUrl":"",
    "time": "11:16:34"
  },
  {
    "id": 10,
    "likeCount": 427,
    "commentCount": 446,
    "shareCount": 637,
    "author": "Barnes Madden",
    "videoUrl":"",
    "time": "01:30:06"
  },
  {
    "id": 11,
    "likeCount": 186,
    "commentCount": 748,
    "shareCount": 970,
    "author": "Julie Ryan",
    "videoUrl":"",
    "time": "10:45:04"
  },
  {
    "id": 12,
    "likeCount": 624,
    "commentCount": 52,
    "shareCount": 437,
    "author": "Kasey Marsh",
    "videoUrl":"",
    "time": "05:13:31"
  }
];

describe("Activity Feed", () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: { camera: "YES", microphone: "YES", photos: "YES" },
    });
  });

  xit("Fail canary - if this test passes we have issues", async () => {
    jestExpect(false).to.equal(true);
  });

  describe("Mock Data Post Tests", () => {
    beforeAll(async () => {
      await device.reloadReactNative(); // Reset state at the start a stable block - Quicker tests for stable tests
      await waitFor(element(by.id(`0/likeCount`))) // Wait for a visible element
      .toBeVisible()
      .withTimeout(5000);
    });

    // Mock Data is way fast and not flaky
    mockPosts.forEach(post => {
      // Just a simple single test of pre values - ideally I'd like to pull the values from each post to dynamically test all
      it(`should return the correct initial Likes for ${post.author}'s post`, async () => {
        let likes = await element(by.id(`${post.id}/likeCount`)).getAttributes();
        const likeCount = parseFloat(likes.text.split(" ")[0]);
        jestExpect(likeCount).toBe(post.likeCount);
      });

      it(`should return the correct number of comments on ${post.author}'s post`, async () => {
        let comments = await element(by.id(`${post.id}/commentCount`)).getAttributes();
        const commentCount = parseFloat(comments.text.split(" ")[2]);
        jestExpect(commentCount).toBe(post.commentCount);
      });

      it(`should return the correct author for ${post.author}'s post`, async () => {
        let author = await element(by.id(`${post.id}/author`)).getAttributes();
        const authorName = author.text;
        jestExpect(authorName).toBe(post.author);
      });
    });
  });

  describe("Known Starting State Post Tests", () => {
    // User a random MockPost to test against except last user
    mockPosts.pop();
    const randomPost = mockPosts[Math.floor(Math.random() * mockPosts.length)];
    beforeEach(async () => {
      await device.reloadReactNative(); // Reset state at the start of flaky tests - Slower tests for flaky tests
      await waitFor(element(by.id(`0/likeCount`))) // Wait for a visible element
      .toBeVisible()
      .withTimeout(5000);
      await waitFor(element(by.id(`${randomPost.id}/post`))).toBeVisible().whileElement(by.id('Home')).scroll(500, 'down');
    });

    it(`should increment the Like count when the Like button is pressed on ${randomPost.author}'s post`, async () => {
      await element(by.id(`${randomPost.id}/likeButton`)).tap();
      await new Promise(resolve => setTimeout(resolve, 200));
      let attributes = await element(by.id(`${randomPost.id}/likeCount`)).getAttributes();
      const postTapLikeCount = parseFloat(attributes.text.split(" ")[0]);
      jestExpect(postTapLikeCount).toBe(randomPost.likeCount + 1);
    });

    // Would be better to do with a mock so the post starts in a liked state; however, mocks cannot be run per it block in detox
    it(`should decrement the Like count when the Like button is pressed twice on a ${randomPost.author}'s post`, async () => {
      await element(by.id(`${randomPost.id}/likeButton`)).tap();
      await new Promise(resolve => setTimeout(resolve, 200));
      let attributes = await element(by.id(`${randomPost.id}/likeCount`)).getAttributes();
      const firstTapLikeCount = parseFloat(attributes.text.split(" ")[0]);
      // Check that the like count was incremented to pevent pass on no action
      jestExpect(firstTapLikeCount).toBe(randomPost.likeCount + 1);
      await element(by.id(`${randomPost.id}/likeButton`)).tap()
      attributes = await element(by.id(`${randomPost.id}/likeCount`)).getAttributes();
      const secondTapLikeCount = parseFloat(attributes.text.split(" ")[0]);
      jestExpect(secondTapLikeCount).toBe(randomPost.likeCount);
    });

    it(`should increment the Like count on ${randomPost.author}'s post when double tapped`, async () => { 
      let attributes = await element(by.id(`${randomPost.id}/likeCount`)).getAttributes();
      const preTapLikeCount = parseFloat(attributes.text.split(" ")[0]);
      await element(by.id(`${randomPost.id}/mainPostContent`)).multiTap(2);
      attributes = await element(by.id(`${randomPost.id}/likeCount`)).getAttributes();
      const postTapLikeCount = parseFloat(attributes.text.split(" ")[0]);
      jestExpect(postTapLikeCount).toBe(preTapLikeCount + 1);
    });
  });

  // These tests will all fail because there is a bug in the app when viewing stories
  // More importantly unless properly handled it'll hang the test framework. 
  describe("Story Tests - Should Fail", () => {
    beforeEach(async () => {
      await device.reloadReactNative();
      await device.disableSynchronization(); // Stories currently set the app in a loop so Detox waits indenfintly.
      await waitFor(element(by.text("Cheppard"))) // First user should always be visible at start of test
      .toBeVisible()
      .withTimeout(5000);
    });

    // This is mostly to demonstrate scrolling on a test - All these tests will fail due to a bug in the app
    const stories = ['Steeve', 'Tyrion'] // Simple mock - would have used a larger mock of an array of objects if needed.
    stories.forEach(usersStory=> {
      it(`should load user story for ${usersStory}`, async () => {
        await waitFor(element(by.id(`${usersStory}/story`))).toBeVisible().whileElement(by.id('activityFeedStoryScrollSlider')).scroll(200, 'right');
        await element(by.id(`${usersStory}/story`)).tap();
        await waitFor(element(by.id(`${usersStory}/storyDisplayed`))).toBeVisible().withTimeout(5000); // IMPORTANT Otherwise test suite hangs
        const attributes = await element(by.id(`${usersStory}/storyDisplayed`)).getAttributes();
        const storyOwner = attributes.text.split(" ")[0];
        jestExpect(storyOwner).toBe(usersStory);
      });
    });
  });

  // TODO - Example of a Test Spec Stub
  xdescribe("Comments Tests - Test Stubs", () => { 
    xit("should be able to comment on a post", () => {});

    xit("should be able to like a comment on a post", () => {});

    xit("should be able delete a one's own comment", () => {});

    xit("should be to navigate to comment page", () => {});
  });
});
