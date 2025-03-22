const groupService = require("../../services/group.service");
const ApiResponse = require("../../utils/ApiResponse");
const { asyncHandler } = require("../../utils/asyncHandler");
const { logger } = require("../../utils/helpers/logger.utils");

class GroupController {
  // Create Group
  create = asyncHandler(async (req, res) => {
    logger.info("Group create Request");
    const data = req.body;
    const group = await groupService.createGroup(data);
    logger.info("Group create Request success");
    res.status(200).json(new ApiResponse(200, group, "Group Created"));
  });

  // Update Group
  update = asyncHandler(async (req, res) => {
    //don't take as groupId because it's in model we are using _id here
    const { id } = req.body;
    const data = req.body;
    logger.info(`Group update Request :${id}`);
    const group = await groupService.updateGroup(data);
    logger.info(`Group update id: ${id}`);
    res.status(200).json(new ApiResponse(200, group, "Group Updated"));
  });

  // Fetch All Groups
  fetchAll = asyncHandler(async (req, res) => {
    logger.info(`All Group fetch Request`);
    const groups = await groupService.allGroups();
    logger.info(`All Group fetch Request Success`);
    res.status(200).json(new ApiResponse(200, groups));
  });

  //fetch by id
  fetch = asyncHandler(async (req, res) => {
    const { groupId } = req.body;
    logger.info(`Group fetch Request :${groupId}`);
    const groups = await groupService.fetchById(groupId);
    logger.info(`Group fetch Request Success :${groupId}`);
    res.status(200).json(new ApiResponse(200, groups));
  });
}

module.exports = new GroupController();
