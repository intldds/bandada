import validateReputation from "../validateReputation"

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve({
                followers: 110
            })
    })
) as any

describe("GithubFollowers", () => {
    it("Should return true if a Github user has more than 100 followers", async () => {
        const result = await validateReputation(
            {
                name: "GITHUB_FOLLOWERS",
                criteria: {
                    minFollowers: 100
                }
            },
            { githubAccessToken: "token" }
        )

        expect(result).toBeTruthy()
    })

    it("Should throw a type error if a criteria parameter has the wrong type", async () => {
        const fun = () =>
            validateReputation(
                {
                    name: "GITHUB_FOLLOWERS",
                    criteria: {
                        minFollowers: "100"
                    }
                },
                { githubAccessToken: "token" }
            )

        await expect(fun).rejects.toThrow(
            "Parameter 'minFollowers' is not a number"
        )
    })
})
