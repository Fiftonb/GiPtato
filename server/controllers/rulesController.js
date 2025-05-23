const iptablesService = require('../services/iptablesService');
const sshService = require('../services/sshService');
const cacheService = require('../services/cacheService');

/**
 * 检查服务器连接状态
 * @param {string} serverId - 服务器ID
 * @returns {object} - 连接状态
 */
const checkServerConnection = (serverId) => {
  const connection = sshService.connections[serverId];
  if (!connection) {
    return {
      connected: false,
      message: '服务器未连接，请先连接服务器'
    };
  }
  return { connected: true };
};

/**
 * 获取服务器规则缓存
 */
exports.getServerRulesCache = async (req, res) => {
  try {
    const serverId = req.params.serverId;
    const cache = await cacheService.getServerRulesCache(serverId);
    
    if (!cache) {
      return res.status(404).json({
        success: false,
        message: '服务器规则缓存不存在'
      });
    }
    
    res.status(200).json({
      success: true,
      data: cache
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取服务器规则缓存失败',
      error: error.message
    });
  }
};

/**
 * 获取缓存最后更新时间
 */
exports.getCacheLastUpdate = async (req, res) => {
  try {
    const serverId = req.params.serverId;
    const lastUpdate = await cacheService.getServerCacheLastUpdate(serverId);
    
    if (!lastUpdate) {
      return res.status(404).json({
        success: false,
        message: '服务器规则缓存不存在'
      });
    }
    
    res.status(200).json({
      success: true,
      data: { lastUpdate }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取缓存最后更新时间失败',
      error: error.message
    });
  }
};

/**
 * 获取当前封禁列表 (修改以支持缓存)
 */
exports.getBlockList = async (req, res) => {
  try {
    const serverId = req.params.serverId;
    
    const result = await iptablesService.getBlockList(serverId);
    
    if (result.success) {
      // 如果请求成功，更新缓存
      await cacheService.updateServerCacheItem(serverId, 'blockList', result.data);
    }
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.data,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取封禁列表失败',
      error: error.message
    });
  }
};

/**
 * 封禁BT/PT协议
 */
exports.blockBTPT = async (req, res) => {
  try {
    const result = await iptablesService.blockBTPT(req.params.serverId);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.data,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '封禁BT/PT协议失败',
      error: error.message
    });
  }
};

/**
 * 封禁垃圾邮件端口
 */
exports.blockSPAM = async (req, res) => {
  try {
    const result = await iptablesService.blockSPAM(req.params.serverId);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.data,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '封禁垃圾邮件端口失败',
      error: error.message
    });
  }
};

/**
 * 封禁BT/PT和垃圾邮件
 */
exports.blockAll = async (req, res) => {
  try {
    const result = await iptablesService.blockAll(req.params.serverId);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.data,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '封禁BT/PT和垃圾邮件失败',
      error: error.message
    });
  }
};

/**
 * 封禁自定义端口
 */
exports.blockCustomPorts = async (req, res) => {
  try {
    const { ports } = req.body;
    
    if (!ports) {
      return res.status(400).json({
        success: false,
        message: '端口不能为空'
      });
    }
    
    const result = await iptablesService.blockCustomPorts(req.params.serverId, ports);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.data,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '封禁自定义端口失败',
      error: error.message
    });
  }
};

/**
 * 封禁自定义关键词
 */
exports.blockCustomKeyword = async (req, res) => {
  try {
    const { keyword } = req.body;
    
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: '关键词不能为空'
      });
    }
    
    const result = await iptablesService.blockCustomKeyword(req.params.serverId, keyword);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.data,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '封禁自定义关键词失败',
      error: error.message
    });
  }
};

/**
 * 解封BT/PT协议
 */
exports.unblockBTPT = async (req, res) => {
  try {
    const result = await iptablesService.unblockBTPT(req.params.serverId);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.data,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '解封BT/PT协议失败',
      error: error.message
    });
  }
};

/**
 * 解封垃圾邮件端口
 */
exports.unblockSPAM = async (req, res) => {
  try {
    const result = await iptablesService.unblockSPAM(req.params.serverId);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.data,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '解封垃圾邮件端口失败',
      error: error.message
    });
  }
};

/**
 * 解封BT/PT和垃圾邮件
 */
exports.unblockAll = async (req, res) => {
  try {
    const result = await iptablesService.unblockAll(req.params.serverId);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.data,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '解封BT/PT和垃圾邮件失败',
      error: error.message
    });
  }
};

/**
 * 解封自定义端口
 */
exports.unblockCustomPorts = async (req, res) => {
  try {
    const { ports } = req.body;
    
    if (!ports) {
      return res.status(400).json({
        success: false,
        message: '端口不能为空'
      });
    }
    
    const result = await iptablesService.unblockCustomPorts(req.params.serverId, ports);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.data,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '解封自定义端口失败',
      error: error.message
    });
  }
};

/**
 * 解封自定义关键词
 */
exports.unblockCustomKeyword = async (req, res) => {
  try {
    const { keyword } = req.body;
    
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: '关键词不能为空'
      });
    }
    
    const result = await iptablesService.unblockCustomKeyword(req.params.serverId, keyword);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.data,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '解封自定义关键词失败',
      error: error.message
    });
  }
};

/**
 * 解封所有关键词
 */
exports.unblockAllKeywords = async (req, res) => {
  try {
    const result = await iptablesService.unblockAllKeywords(req.params.serverId);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.data,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '解封所有关键词失败',
      error: error.message
    });
  }
};

/**
 * 获取当前放行的入网端口 (修改以支持缓存)
 */
exports.getInboundPorts = async (req, res) => {
  try {
    const serverId = req.params.serverId;
    const result = await iptablesService.getInboundPorts(serverId);
    
    if (result.success) {
      // 如果请求成功，更新缓存
      await cacheService.updateServerCacheItem(serverId, 'inboundPorts', result.data);
    }
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.data,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取入网端口失败',
      error: error.message
    });
  }
};

/**
 * 获取当前放行的入网IP (修改以支持缓存)
 */
exports.getInboundIPs = async (req, res) => {
  try {
    const serverId = req.params.serverId;
    const result = await iptablesService.getInboundIPs(serverId);
    
    if (result.success) {
      // 如果请求成功，更新缓存
      await cacheService.updateServerCacheItem(serverId, 'inboundIPs', result.data);
    }
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.data,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取入网IP失败',
      error: error.message
    });
  }
};

/**
 * 放行入网端口
 */
exports.allowInboundPorts = async (req, res) => {
  try {
    const { ports } = req.body;
    
    if (!ports) {
      return res.status(400).json({
        success: false,
        message: '端口不能为空'
      });
    }
    
    const result = await iptablesService.allowInboundPorts(req.params.serverId, ports);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.data,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '放行入网端口失败',
      error: error.message
    });
  }
};

/**
 * 取消放行入网端口
 */
exports.disallowInboundPorts = async (req, res) => {
  try {
    const { ports } = req.body;
    
    if (!ports) {
      return res.status(400).json({
        success: false,
        message: '端口不能为空'
      });
    }
    
    const result = await iptablesService.disallowInboundPorts(req.params.serverId, ports);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.data,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '取消放行入网端口失败',
      error: error.message
    });
  }
};

/**
 * 放行入网IP
 */
exports.allowInboundIPs = async (req, res) => {
  try {
    const { ips } = req.body;
    
    if (!ips) {
      return res.status(400).json({
        success: false,
        message: 'IP不能为空'
      });
    }
    
    const result = await iptablesService.allowInboundIPs(req.params.serverId, ips);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.data,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '放行入网IP失败',
      error: error.message
    });
  }
};

/**
 * 取消放行入网IP
 */
exports.disallowInboundIPs = async (req, res) => {
  try {
    const { ips } = req.body;
    
    if (!ips) {
      return res.status(400).json({
        success: false,
        message: 'IP不能为空'
      });
    }
    
    const result = await iptablesService.disallowInboundIPs(req.params.serverId, ips);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.data,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '取消放行入网IP失败',
      error: error.message
    });
  }
};

/**
 * 获取当前SSH端口 (修改以支持缓存)
 */
exports.getSSHPort = async (req, res) => {
  try {
    const serverId = req.params.serverId;
    const result = await iptablesService.getSSHPort(serverId);
    
    if (result.success) {
      // 如果请求成功，更新缓存
      await cacheService.updateServerCacheItem(serverId, 'sshPortStatus', result.data);
    }
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.data,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取SSH端口失败',
      error: error.message
    });
  }
};

/**
 * 清空所有规则
 */
exports.clearAllRules = async (req, res) => {
  try {
    const result = await iptablesService.clearAllRules(req.params.serverId);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.data,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '清空所有规则失败',
      error: error.message
    });
  }
};

/**
 * 清除服务器规则缓存
 */
exports.clearServerCache = async (req, res) => {
  try {
    const serverId = req.params.serverId;
    const success = await cacheService.clearServerRulesCache(serverId);
    
    res.status(200).json({
      success: success,
      message: success ? '缓存清除成功' : '缓存清除失败'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '清除缓存失败',
      error: error.message
    });
  }
};

/**
 * 更新服务器缓存项
 */
exports.updateCacheItem = async (req, res) => {
  try {
    const serverId = req.params.serverId;
    const key = req.params.key;
    const { value } = req.body;
    
    if (!key) {
      return res.status(400).json({
        success: false,
        message: '缓存键名不能为空'
      });
    }
    
    const success = await cacheService.updateServerCacheItem(serverId, key, value);
    
    res.status(200).json({
      success: success,
      message: success ? `缓存项 ${key} 更新成功` : `缓存项 ${key} 更新失败`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新缓存项失败',
      error: error.message
    });
  }
}; 