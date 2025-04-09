import { httpclient } from "../request";

export const submitRating = (paperId: number, Rating: string) =>
  httpclient.Post("/vote/submit", {
    paperId,
    voteValue: Rating
  });

export const updateRating = (paperId: number, Rating: number) =>
  httpclient.Post("/vote/update", {
    paperId,
    voteValue: Rating
  });

export const getVoteBypaperId = (paperId: number) =>
  httpclient.Post("/vote/ratingget", {
    paperId
  });

export const getVoteByUserIdandPaperId = (paperId: number, voteValue: number) =>
  httpclient.Post("/vote/ratinggetByuserIdandPaperId", {
    paperId,
    voteValue
  });
