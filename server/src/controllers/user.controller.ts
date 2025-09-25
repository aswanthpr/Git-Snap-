import type { Request, Response, NextFunction } from "express";
import { HttpResponse, HttpStatus } from "../constants";
import { Friend, Repository, User } from "../models";
import {
  fetchGitHubFollowers,
  fetchGitHubFollowing,
  fetchGitHubRepos,
  fetchGitHubUser,
} from "../integration/github.user.fetch";
import { Op } from "sequelize";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.body;

    if (!username || typeof username !== "string") {
      return res
        .status(HttpStatus?.BAD_REQUEST)
        .json({ message: HttpResponse.USERNAME_REQUIRED, data: null });
    }

    let user = await User.findOne({
      where: { username },
      include: [{ model: Repository, as: "Repositories" }],
    });

    if (user) {
      const plainUser = user.toJSON() as any;
      const { Repositories, ...users } = plainUser;

      return res.json({
        message: HttpResponse.RESOURCE_FOUND,
        repo: Repositories,
        user: users,
      });
    }
    //fetch user && repo
    const [data, repos] = await Promise.all([
      fetchGitHubUser(username),
      fetchGitHubRepos(username),
    ]);

    if (!data) {
      return res.status(HttpStatus?.NOT_FOUND).json({
        success: false,
        message: HttpResponse?.USER_NOT_FOUND,
        data: null,
      });
    }
    //save user
    user = await User.create({
      githubId: data?.id,
      username: data.login,
      avatarUrl: data.avatar_url,
      location: data.location,
      blog: data.blog,
      bio: data.bio,
      publicRepos: data.public_repos,
      publicGists: data.public_gists,
      followers: data.followers,
      following: data.following,
      createdAt: new Date(data.created_at),
    });
    //save repo
    
    const reposToSave = repos.map((repo: any) => ({
      repoId: repo.id,
      name: repo.name,
      description: repo.description,
      htmlUrl: repo.html_url,
      language: repo.language,
      stargazers: repo.stargazers_count,
      userId: user.id,
    }));
    
    let savedRepos = [];
    if (reposToSave.length > 0) {
      try {
        
         savedRepos = await Repository.bulkCreate(reposToSave, {
          updateOnDuplicate: [
            "name",
            "description",
            "htmlUrl",
            "language",
            "stargazers",
          ],
        });
        console.log(reposToSave.length,'len')
      } catch (error) {
         console.log(error instanceof Error ? error.message : error, "bulk write error");
      }
    }

    //  Save mutual
    res.status(HttpStatus?.OK).json({
      success: true,
      message: HttpResponse?.RESOURCE_FOUND,
      user: user.toJSON(),
      repo: savedRepos.map((r) => r.toJSON()),
    });
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : String(error));
    next(error);
  }
};

export const getMutualFriends = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.body.userId);

    if (userId == null || userId == undefined) {
      return res
        .status(HttpStatus?.BAD_REQUEST)
        .json({ message: HttpResponse.CREDENTIAL_REQUIRED, mutual: [] });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: HttpResponse.USER_NOT_FOUND,
        mutual: [],
      });
    }
    // Check existing mutual friends
    const existingFriendsData = await Friend.findAll({
      where: { userId },
    });
    if (existingFriendsData.length > 0) {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: HttpResponse.RESOURCE_FOUND,
        mutual: existingFriendsData,
      });
    }

    const username = user.username;

    const [followers, following] = await Promise.all([
      fetchGitHubFollowers(username),
      fetchGitHubFollowing(username),
    ]);

    const mutuals = followers.filter((f: any) =>
      following.some(
        (fl: any) => fl.login.toLowerCase() === f.login.toLowerCase()
      )
    );

    if (mutuals.length === 0) {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: HttpResponse?.NO_MUTUAL_FRIENDS,
        data: [],
      });
    }

    const friendsToSave = mutuals.map((mutual: any) => ({
      userId: user.id,
      username: mutual.login,
      avatarUrl: mutual.avatar_url || "",
      githubUrl: mutual.html_url || "",
    }));

    const mutualData = await Friend.bulkCreate(friendsToSave, {
      ignoreDuplicates: true,
    });

    return res.status(HttpStatus?.OK).json({
      success: true,
      message: HttpResponse?.RESOURCE_FOUND,
      mutual: mutualData.map((r) => r.toJSON()),
    });
  } catch (error: any) {
    console.log(error.message);
    next(error);
  }
};

export const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { username, location, publicRepos, page, limit } = req.query;
    username = username ? String(username) : "";
    location = location ? String(location) : "";
    publicRepos = publicRepos ? String(publicRepos) : "";

    const pageNumber = page ? parseInt(String(page), 10) : 1;
    const pageSize = limit ? parseInt(String(limit), 10) : 20;
    const offset = (pageNumber - 1) * pageSize;

    const whereClause: any = {};

    if (username) {
      whereClause.username = { [Op.iLike]: `%${username}%` };
    }
    if (location) {
      whereClause.location = { [Op.iLike]: `%${location}%` };
    }
    if (publicRepos) {
      whereClause.blog = { [Op.iLike]: `%${publicRepos}%` };
    }

    const { rows: users, count: total } = await User.findAndCountAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit: pageSize,
      offset,
    });

    if (!users || users.length === 0) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: HttpResponse.RESOURCE_NOT_FOUND,
        data: [],
        total: 0,
        page: pageNumber,
        limit: pageSize,
      });
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: HttpResponse.RESOURCE_FOUND,
      data: users.map((f) => f.toJSON()),
      total,
      page: pageNumber,
      limit: pageSize,
    });
  } catch (error: any) {
    console.log(error.message);
    next(error);
  }
};

export const softDeleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, action } = req.body;

    if (!username || typeof username !== "string") {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: HttpResponse.USERNAME_REQUIRED,
      });
    }

    const user = await User.findOne({ where: { username }, paranoid: false });

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: HttpResponse.USER_NOT_FOUND,
      });
    }
    if (action === "delete") {
      if (user.deletedAt) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: HttpResponse?.USER_ALREADY_DELETED,
        });
      }

      // Soft delete
      await user.destroy();

      return res.status(HttpStatus.OK).json({
        success: true,
        message: `'${username}' has been soft deleted successfully.`,
        data: null,
      });
    } else if (action === "restore") {
      if (!user.deletedAt) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: HttpResponse?.USER_ACTIVE,
        });
      }
      await user.restore();
      return res.status(HttpStatus.OK).json({
        success: true,
        message: `'${username}' has been restored successfully.`,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: HttpResponse?.INVALID_DELETE_ACTION,
      });
    }
  } catch (error: any) {
    console.log(error.message);
    next(error);
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, location, blog, bio } = req.body;

    if (!username || typeof username !== "string") {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: HttpResponse.USERNAME_REQUIRED,
      });
    }

    //Find  user
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: HttpResponse.USER_NOT_FOUND,
      });
    }

    // Update  fields
    const updatedData: Partial<{
      location: string;
      blog: string;
      bio: string;
    }> = {};
    if (location) updatedData.location = location;
    if (blog) updatedData.blog = blog;
    if (bio) updatedData.bio = bio;

    if (Object.keys(updatedData).length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: HttpResponse?.NO_FIELDS_FOR_UPDATE,
      });
    }

    // update
    await user.update(updatedData);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: HttpResponse?.UPDATED_SUCCESSFULLY,
      data: user.toJSON(),
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { sortBy, order, page, limit } = req.query;

    // sorting
    const allowedSortFields = [
      "publicRepos",
      "publicGists",
      "followers",
      "following",
      "createdAt",
    ];

    const sortField =
      typeof sortBy === "string" && allowedSortFields.includes(sortBy)
        ? sortBy
        : "createdAt";

    const sortOrder = order === "desc" ? "DESC" : "ASC";

    // Pagination
    const pageNumber = page ? parseInt(page as string, 10) : 1;
    const pageSize = limit ? parseInt(limit as string, 10) : 10;
    const offset = (pageNumber - 1) * pageSize;

    const users = await User.findAll({
      order: [[sortField, sortOrder]],
      limit: pageSize,
      offset,
    });

    if (!users || users.length === 0) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: HttpResponse?.NO_USERS_FOUND,
        data: [],
      });
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: HttpResponse?.USER_FECHED_SUCCESSFULLY,
      data: users.map((u) => u.toJSON()),
      pagination: {
        page: pageNumber,
        limit: pageSize,
      },
    });
  } catch (error) {
    next(error);
  }
};
