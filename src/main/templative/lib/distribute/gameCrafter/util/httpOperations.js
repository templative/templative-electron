const httpClient = require('./httpClient.js');

const gameCrafterBaseUrl = "https://www.thegamecrafter.com/api";

async function login(gameCrafterSession, publicApiKey, userName, userPassword) {
    const url = `${gameCrafterBaseUrl}/session`;
    return await httpClient.post(gameCrafterSession, url, {
        api_key_id: publicApiKey,
        username: userName,
        password: userPassword
    });
}

async function logout(gameCrafterSession) {
    const url = `${gameCrafterBaseUrl}/session/${gameCrafterSession.sessionId}`;
    await httpClient.delete(gameCrafterSession, url);
    await gameCrafterSession.close();
}

async function postFolder(gameCrafterSession, name, folderParentId) {
    const url = `${gameCrafterBaseUrl}/folder`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        user_id: gameCrafterSession.userId,
        parent_id: folderParentId
    });
}

async function postFile(gameCrafterSession, filepath, filename, folderId) {
    const url = `${gameCrafterBaseUrl}/file`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        file: filepath,
        name: filename,
        folder_id: folderId
    });
}

async function postGame(gameCrafterSession, name, designerId, shortDescription, longDescription, coolFactors, logoFileId, backdropFileId, advertisementFileId, websiteUrl, category, minAge, playTime, minPlayers, maxPlayers) {
    const url = `${gameCrafterBaseUrl}/game`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        designer_id: designerId,
        short_description: shortDescription,
        description: longDescription,
        cool_factor_1: coolFactors[0] || "",
        cool_factor_2: coolFactors[1] || "",
        cool_factor_3: coolFactors[2] || "",
        logo_id: logoFileId,
        backdrop_id: backdropFileId,
        advertisement_id: advertisementFileId,
        private_sales: 1,
        private_viewing: 1,
        website_uri: websiteUrl,
        category: category,
        min_age: minAge,
        play_time: playTime,
        min_players: minPlayers,
        max_players: maxPlayers
    });
}

async function deleteGame(gameCrafterSession, id) {
    const url = `${gameCrafterBaseUrl}/game/${id}`;
    return await httpClient.delete(gameCrafterSession, url);
}

async function getUser(gameCrafterSession) {
    const url = `${gameCrafterBaseUrl}/user/${gameCrafterSession.userId}`;
    return await httpClient.get(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId
    });
}

async function getDesigners(gameCrafterSession) {
    const url = `${gameCrafterBaseUrl}/user/${gameCrafterSession.userId}/designers`;
    return await httpClient.get(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId
    });
}

async function getGamesForDesignerId(gameCrafterSession, designerId) {
    const url = `${gameCrafterBaseUrl}/designer/${designerId}/games`;
    return await httpClient.get(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId
    });
}

async function getGamesForUser(gameCrafterSession) {
    const url = `${gameCrafterBaseUrl}/user/${gameCrafterSession.userId}/games`;
    return await httpClient.get(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId
    });
}

async function createActionShot(gameCrafterSession, gameId, advertisementFileId) {
    const url = `${gameCrafterBaseUrl}/actionshot`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        game_id: gameId,
        image_id: advertisementFileId
    });
}

async function postStockPart(gameCrafterSession, stockPartId, quantity, gameId) {
    const url = `${gameCrafterBaseUrl}/gamepart`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        game_id: gameId,
        quantity: quantity,
        part_id: stockPartId
    });
}

async function postTwoSidedSet(gameCrafterSession, name, identity, quantity, gameId, backImageId, isProofed) {
    const url = `${gameCrafterBaseUrl}/twosidedset`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        quantity: quantity,
        identity: identity,
        back_id: backImageId,
        has_proofed_back: isProofed
    });
}

async function postTwoSided(gameCrafterSession, name, setId, quantity, faceImageId, isProofed) {
    const url = `${gameCrafterBaseUrl}/twosided`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        set_id: setId,
        quantity: quantity,
        face_id: faceImageId,
        has_proofed_face: isProofed
    });
}

async function postHookBox(gameCrafterSession, name, gameId, quantity, outsideImageId, insideImageId, identity, isProofed) {
    const url = `${gameCrafterBaseUrl}/hookbox`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        quantity: quantity,
        outside_id: outsideImageId,
        inside_id: insideImageId,
        identity: identity,
        has_proofed_outside: isProofed,
        has_proofed_inside: isProofed
    });
}

async function postBoxFace(gameCrafterSession, name, gameId, quantity, faceImageId, identity, isProofed) {
    const url = `${gameCrafterBaseUrl}/boxface`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        quantity: quantity,
        face_id: faceImageId,
        identity: identity,
        has_proofed_face: isProofed
    });
}

async function postTuckBox(gameCrafterSession, name, identity, quantity, gameId, imageId, isProofed) {
    const url = `${gameCrafterBaseUrl}/tuckbox`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        quantity: quantity,
        outside_id: imageId,
        identity: identity,
        has_proofed_outside: isProofed
    });
}

async function postDeck(gameCrafterSession, name, identity, quantity, gameId, backImageFileId, isProofed) {
    const url = `${gameCrafterBaseUrl}/deck`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        identity: identity,
        quantity: quantity,
        back_id: backImageFileId,
        has_proofed_back: isProofed
    });
}

async function postDeckCard(gameCrafterSession, name, deckId, quantity, imageFileId, isProofed) {
    const url = `${gameCrafterBaseUrl}/card`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        deck_id: deckId,
        quantity: quantity,
        face_id: imageFileId,
        back_from: "Deck",
        has_proofed_face: isProofed,
        has_proofed_back: isProofed
    });
}

async function postTwoSidedBox(gameCrafterSession, cloudGameId, componentName, identity, quantity, topImageFileId, bottomImageFileId, isProofed) {
    const url = `${gameCrafterBaseUrl}/twosidedbox`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: componentName,
        game_id: cloudGameId,
        quantity: quantity,
        identity: identity,
        top_id: topImageFileId,
        has_proofed_top: isProofed,
        bottom_id: bottomImageFileId,
        has_proofed_bottom: isProofed
    });
}

async function postTwoSidedSluggedSet(gameCrafterSession, name, identity, quantity, gameId, backImageFileId, isProofed) {
    const url = `${gameCrafterBaseUrl}/twosidedsluggedset`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        identity: identity,
        quantity: quantity,
        back_id: backImageFileId,
        has_proofed_back: isProofed
    });
}

async function postTwoSidedSlugged(gameCrafterSession, name, setId, quantity, imageFileId, isProofed) {
    const url = `${gameCrafterBaseUrl}/twosidedslugged`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        set_id: setId,
        quantity: quantity,
        face_id: imageFileId,
        has_proofed_face: isProofed,
        has_proofed_back: isProofed
    });
}

async function postDownloadableDocument(gameCrafterSession, gameId, pdfFileId) {
    const url = `${gameCrafterBaseUrl}/gamedownload`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        game_id: gameId,
        file_id: pdfFileId,
        name: "rules.pdf"
    });
}

async function postDocument(gameCrafterSession, name, quantity, gameId, pdfFileId, isProofed) {
    const url = `${gameCrafterBaseUrl}/document`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        quantity: quantity,
        identity: "Document",
        pdf_id: pdfFileId,
        use_for: "Download"
    });
}

async function postCustomWoodenDie(gameCrafterSession, gameId, name, quantity, sideFileIds, isProofed) {
    if (sideFileIds.length !== 6) {
        throw new Error(`A D6 needs 6 sides, but only ${sideFileIds.length} were given.`);
    }

    const url = `${gameCrafterBaseUrl}/customwoodd6`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        quantity: quantity,
        side1_id: sideFileIds[0],
        side2_id: sideFileIds[1],
        side3_id: sideFileIds[2],
        side4_id: sideFileIds[3],
        side5_id: sideFileIds[4],
        side6_id: sideFileIds[5],
        has_proofed_side1: isProofed,
        has_proofed_side2: isProofed,
        has_proofed_side3: isProofed,
        has_proofed_side4: isProofed,
        has_proofed_side5: isProofed,
        has_proofed_side6: isProofed
    });
}

async function postCustomD4(gameCrafterSession, name, gameId, quantity, color, sideFileIds, isProofed) {
    if (sideFileIds.length !== 4) {
        throw new Error(`A D6 needs 4 sides, but only ${sideFileIds.length} were given.`);
    }

    const url = `${gameCrafterBaseUrl}/customcolord4`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        quantity: quantity,
        diecolor: color,
        identity: "CustomColorD4",
        side1_id: sideFileIds[0],
        side2_id: sideFileIds[1],
        side3_id: sideFileIds[2],
        side4_id: sideFileIds[3],
        has_proofed_side1: isProofed,
        has_proofed_side2: isProofed,
        has_proofed_side3: isProofed,
        has_proofed_side4: isProofed
    });
}

async function postCustomD6(gameCrafterSession, name, gameId, quantity, color, sideFileIds, isProofed) {
    if (sideFileIds.length !== 6) {
        throw new Error(`A D6 needs 6 sides, but only ${sideFileIds.length} were given.`);
    }

    const url = `${gameCrafterBaseUrl}/customcolord6`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        quantity: quantity,
        color: color,
        identity: "CustomColorD6",
        side1_id: sideFileIds[0],
        side2_id: sideFileIds[1],
        side3_id: sideFileIds[2],
        side4_id: sideFileIds[3],
        side5_id: sideFileIds[4],
        side6_id: sideFileIds[5],
        has_proofed_side1: isProofed,
        has_proofed_side2: isProofed,
        has_proofed_side3: isProofed,
        has_proofed_side4: isProofed,
        has_proofed_side5: isProofed,
        has_proofed_side6: isProofed
    });
}

async function postCustomD8(gameCrafterSession, name, gameId, quantity, color, sideFileIds, isProofed) {
    if (sideFileIds.length !== 8) {
        throw new Error(`A D8 needs 8 sides, but only ${sideFileIds.length} were given.`);
    }
    
    const url = `${gameCrafterBaseUrl}/customcolord8`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        quantity: quantity,
        color: color,
        identity: "CustomColorD8",
        side1_id: sideFileIds[0],
        side2_id: sideFileIds[1],
        side3_id: sideFileIds[2],
        side4_id: sideFileIds[3],
        side5_id: sideFileIds[4],
        side6_id: sideFileIds[5],
        side7_id: sideFileIds[6],
        side8_id: sideFileIds[7],
        has_proofed_side1: isProofed,
        has_proofed_side2: isProofed,
        has_proofed_side3: isProofed,
        has_proofed_side4: isProofed,
        has_proofed_side5: isProofed,
        has_proofed_side6: isProofed,
        has_proofed_side7: isProofed,
        has_proofed_side8: isProofed
    });
}

async function getCustomPartInfo(gameCrafterSession) {
    const url = `${gameCrafterBaseUrl}/tgc/products`;
    return await httpClient.get(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId
    });
}

async function getStockPartInfo(gameCrafterSession, pageNumber = 1) {
    const url = `${gameCrafterBaseUrl}/part?_page_number=${pageNumber}`;
    return await httpClient.get(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId
    });
}

async function postOneSidedSluggedSet(gameCrafterSession, name, identity, quantity, gameId, isProofed) {
    const url = `${gameCrafterBaseUrl}/onesidedsluggedset`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        identity: identity,
        quantity: quantity
    });
}

async function postOneSidedSlugged(gameCrafterSession, name, setId, quantity, imageFileId, isProofed) {
    const url = `${gameCrafterBaseUrl}/onesidedslugged`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        set_id: setId,
        quantity: quantity,
        face_id: imageFileId,
        has_proofed_face: isProofed
    });
}

async function postCustomWoodD6(gameCrafterSession, name, gameId, quantity, sideFileIds, isProofed) {
    if (sideFileIds.length !== 6) {
        throw new Error(`A wooden D6 needs 6 sides, but only ${sideFileIds.length} were given.`);
    }
    
    const url = `${gameCrafterBaseUrl}/customwoodd6`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        quantity: quantity,
        identity: "CustomWoodD6",
        side1_id: sideFileIds[0],
        side2_id: sideFileIds[1],
        side3_id: sideFileIds[2],
        side4_id: sideFileIds[3],
        side5_id: sideFileIds[4],
        side6_id: sideFileIds[5],
        has_proofed_side1: isProofed,
        has_proofed_side2: isProofed,
        has_proofed_side3: isProofed,
        has_proofed_side4: isProofed,
        has_proofed_side5: isProofed,
        has_proofed_side6: isProofed
    });
}

async function postTwoSidedBoxGloss(gameCrafterSession, cloudGameId, componentName, identity, quantity, topImageFileId, bottomImageFileId, isProofed) {
    const url = `${gameCrafterBaseUrl}/twosidedboxgloss`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: componentName,
        game_id: cloudGameId,
        quantity: quantity,
        identity: identity,
        top_id: topImageFileId,
        bottom_id: bottomImageFileId,
        has_proofed_top: isProofed,
        has_proofed_bottom: isProofed,
        surfacing_treatment: "gloss"
    });
}

async function postScorePad(gameCrafterSession, name, gameId, quantity, imageFileId, pageCount, identity, isProofed) {
    const url = `${gameCrafterBaseUrl}/scorepad`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        quantity: quantity,
        image_id: imageFileId,
        page_count: pageCount,
        has_proofed_image: isProofed,
        identity: identity
    });
}

async function postOneSided(gameCrafterSession, name, gameId, quantity, faceImageId, identity, isProofed) {
    const url = `${gameCrafterBaseUrl}/onesided`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        quantity: quantity,
        face_id: faceImageId,
        identity: identity,
        has_proofed_face: isProofed
    });
}

async function postOneSidedGloss(gameCrafterSession, name, gameId, quantity, faceImageId, identity, isProofed, spotGlossId = null) {
    const url = `${gameCrafterBaseUrl}/onesidedgloss`;
    const params = {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        quantity: quantity,
        face_id: faceImageId,
        identity: identity,
        has_proofed_face: isProofed,
        surfacing_treatment: "gloss"
    };
    
    if (spotGlossId) {
        params.spot_gloss_id = spotGlossId;
        params.has_proofed_spot_gloss = isProofed;
        params.surfacing_treatment = "spot_gloss";
    }
    
    return await httpClient.post(gameCrafterSession, url, params);
}

async function postDial(gameCrafterSession, name, gameId, quantity, outsideImageId, identity, isProofed) {
    const url = `${gameCrafterBaseUrl}/dial`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        quantity: quantity,
        outside_id: outsideImageId,
        identity: identity,
        has_proofed_outside: isProofed
    });
}

async function postCustomPrintedMeeple(gameCrafterSession, name, gameId, quantity, side1ImageId, side2ImageId, diecolor, isProofed) {
    const url = `${gameCrafterBaseUrl}/customprintedmeeple`;
    const params = {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        quantity: quantity,
        identity: "CustomPrintedMeeple",
        diecolor: diecolor || "white",
        has_proofed_side1: isProofed
    };
    
    if (side1ImageId) {
        params.side1_id = side1ImageId;
    }
    
    if (side2ImageId) {
        params.side2_id = side2ImageId;
        params.has_proofed_side2 = isProofed;
    }
    
    return await httpClient.post(gameCrafterSession, url, params);
}

async function postBoxTop(gameCrafterSession, name, gameId, quantity, topImageId, identity, isProofed) {
    const url = `${gameCrafterBaseUrl}/boxtop`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        quantity: quantity,
        top_id: topImageId,
        identity: identity,
        has_proofed_top: isProofed
    });
}

async function postBoxTopGloss(gameCrafterSession, name, gameId, quantity, topImageId, identity, isProofed, spotGlossId = null) {
    const url = `${gameCrafterBaseUrl}/boxtopgloss`;
    const params = {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        quantity: quantity,
        top_id: topImageId,
        identity: identity,
        has_proofed_top: isProofed,
        surfacing_treatment: "gloss"
    };
    
    if (spotGlossId) {
        params.spot_gloss_id = spotGlossId;
        params.has_proofed_spot_gloss = isProofed;
        params.surfacing_treatment = "spot_gloss";
    }
    
    return await httpClient.post(gameCrafterSession, url, params);
}

async function postPerfectBoundBook(gameCrafterSession, name, gameId, quantity, identity, pageCount, spineImageId = null, isProofed = false) {
    const url = `${gameCrafterBaseUrl}/perfectboundbook`;
    const params = {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        quantity: quantity,
        identity: identity,
        page_count: pageCount
    };
    
    if (spineImageId) {
        params.spine_image_id = spineImageId;
        params.has_proofed_spine = isProofed;
    }
    
    return await httpClient.post(gameCrafterSession, url, params);
}

async function postPerfectBoundBookPage(gameCrafterSession, name, bookletId, sequenceNumber, imageId, isProofed) {
    const url = `${gameCrafterBaseUrl}/perfectboundbookpage`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        booklet_id: bookletId,
        sequence_number: sequenceNumber,
        image_id: imageId,
        has_proofed_image: isProofed
    });
}

async function postCoilBook(gameCrafterSession, name, gameId, quantity, identity, pageCount, isProofed) {
    const url = `${gameCrafterBaseUrl}/coilbook`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        game_id: gameId,
        quantity: quantity,
        identity: identity,
        page_count: pageCount
    });
}

async function postCoilBookPage(gameCrafterSession, name, coilbookId, sequenceNumber, imageId, isProofed) {
    const url = `${gameCrafterBaseUrl}/coilbookpage`;
    return await httpClient.post(gameCrafterSession, url, {
        session_id: gameCrafterSession.sessionId,
        name: name,
        coilbook_id: coilbookId,
        sequence_number: sequenceNumber,
        image_id: imageId,
        has_proofed_image: isProofed
    });
}

module.exports = {
    login,
    logout,
    postFolder,
    postFile,
    postGame,
    deleteGame,
    getUser,
    getDesigners,
    getGamesForDesignerId,
    getGamesForUser,
    createActionShot,
    postStockPart,
    postTwoSidedSet,
    postTwoSided,
    postHookBox,
    postBoxFace,
    postTuckBox,
    postDeck,
    postDeckCard,
    postTwoSidedBox,
    postTwoSidedSluggedSet,
    postTwoSidedSlugged,
    postDownloadableDocument,
    postDocument,
    postCustomWoodenDie,
    postCustomD4,
    postCustomD6,
    postCustomD8,
    getCustomPartInfo,
    getStockPartInfo,
    postOneSidedSluggedSet,
    postOneSidedSlugged,
    postCustomWoodD6,
    postTwoSidedBoxGloss,
    postScorePad,
    postOneSided,
    postOneSidedGloss,
    postDial,
    postCustomPrintedMeeple,
    postBoxTop,
    postBoxTopGloss,
    postPerfectBoundBook,
    postPerfectBoundBookPage,
    postCoilBook,
    postCoilBookPage
};