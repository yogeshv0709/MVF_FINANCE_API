const ApiError = require("../errors/ApiErrors");
const GroupModel = require("../models/Group.model");

class GroupService {
  //fetch All groups
  async allGroups() {
    return await GroupModel.find();
  }
  //fetch by Id
  async fetchById(groupId) {
    return await GroupModel.findById(groupId);
  }
  // Create a new group
  async createGroup(data) {
    const group = await GroupModel.findOne({ name: data.name });
    if (group) {
      throw new ApiError(400, "Name  already taken");
    }
    const newGroup = new GroupModel(data);
    return await newGroup.save();
  }

  // Update an existing group
  async updateGroup(data) {
    const { id, name } = data;
    if (name) {
      const existingGroup = await GroupModel.findOne({ name, _id: { $ne: id } });
      if (existingGroup) {
        throw new ApiError(400, "Name already taken");
      }
    }
    const updatedGroup = await GroupModel.findByIdAndUpdate({ _id: id }, data, { new: true });
    if (!updatedGroup) throw new ApiError(404, "Group not found");
    return updatedGroup;
  }
}

module.exports = new GroupService();
