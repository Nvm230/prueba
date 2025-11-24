package com.univibe.call.dto;

import com.univibe.call.model.CallContextType;
import com.univibe.call.model.CallMode;

public record CreateCallRequest(
        CallContextType contextType,
        Long contextId,
        CallMode mode
) {}
















