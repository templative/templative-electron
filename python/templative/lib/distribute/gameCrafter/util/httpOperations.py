from templative.lib.distribute.gameCrafter.util import httpClient

gameCrafterBaseUrl = "https://www.thegamecrafter.com/api"

async def login(gameCrafterSession, publicApiKey, userName, userPassword):
    url = "%s/session" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        api_key_id = publicApiKey,
        username = userName,
        password = userPassword
    )
    
async def logout(gameCrafterSession):
    url = "%s/session/%s" % (gameCrafterBaseUrl, gameCrafterSession.sessionId)
    await httpClient.delete(gameCrafterSession, url)
    await gameCrafterSession.httpSession.close()

async def postFolder(gameCrafterSession, name, folderParentId):
    url = "%s/folder" % gameCrafterBaseUrl

    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name=name,
        user_id=gameCrafterSession.userId,
        parent_id=folderParentId,
    )

async def postFile(gameCrafterSession, file, filename, folderId):
    url = "%s/file" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        file=file,
        name=filename,
        folder_id=folderId)


async def postGame(gameCrafterSession, name, designerId, shortDescription, longDescription, coolFactors, logoFileId:str, backdropFileId:str, advertisementFileId:str, websiteUrl, category, minAge:str, playTime:str, minPlayers:str, maxPlayers:str):
    url = "%s/game" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        designer_id = designerId,
        short_description=shortDescription,
        description=longDescription,
        cool_factor_1=coolFactors[0],
        cool_factor_2=coolFactors[1],
        cool_factor_3=coolFactors[2],
        logo_id=logoFileId,
        backdrop_id=backdropFileId,
        advertisement_id=advertisementFileId,
        private_sales=1,
        private_viewing=1,
        website_uri=websiteUrl,
        category=category,
        min_age=minAge,
        play_time=playTime,
        min_players=minPlayers,
        max_players=maxPlayers
    )

async def deleteGame(gameCrafterSession, id):
    url = "%s/game/%s" % (gameCrafterBaseUrl, id)
    return await httpClient.delete(gameCrafterSession, url)

async def getUser(gameCrafterSession):
    url = "%s/user/%s" % (gameCrafterBaseUrl, gameCrafterSession.userId)
    return await httpClient.get(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId
    )

async def getDesigners(gameCrafterSession):
    url = "%s/user/%s/designers" % (gameCrafterBaseUrl, gameCrafterSession.userId)
    return await httpClient.get(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId
    )

async def getGamesForDesignerId(gameCrafterSession, designerId):
    url = "%s/designer/%s/games" % (gameCrafterBaseUrl, designerId)
    return await httpClient.get(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId
    )

async def getGamesForUser(gameCrafterSession):
    url = "%s/user/%s/games" % (gameCrafterBaseUrl, gameCrafterSession.userId)
    return await httpClient.get(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId
    )

async def createActionShot(gameCrafterSession, gameId, advertisementFileId:str):
    url = "%s/actionshot" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        game_id=gameId,
        image_id=advertisementFileId,
    )

async def postStockPart(gameCrafterSession, stockPartId, quantity, gameId):
    url = "%s/gamepart" % (gameCrafterBaseUrl)
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        game_id = gameId,
        quantity = quantity,
        part_id = stockPartId
    )

async def postTwoSidedSet(gameCrafterSession, name, identity, quantity, gameId, backImageId, isProofed):
    url = "%s/twosidedset" % (gameCrafterBaseUrl)
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        game_id = gameId,
        quantity = quantity,
        identity = identity,
        back_id = backImageId,
        has_proofed_back = isProofed,
    )

async def postTwoSided(gameCrafterSession, name, setId, quantity, faceImageId, isProofed):
    url = "%s/twosided" % (gameCrafterBaseUrl)
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        set_id = setId,
        quantity = quantity,
        face_id = faceImageId,
        has_proofed_face = isProofed,
    )

async def postHookBox(gameCrafterSession, name, gameId, quantity, outsideImageId, insideImageId, identity, isProofed):
    url = "%s/hookbox" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        game_id = gameId,
        quantity = quantity,
        outside_id = outsideImageId,
        inside_id = insideImageId,
        identity = identity,
        has_proofed_outside = isProofed,
        has_proofed_inside = isProofed
    )

async def postBoxFace(gameCrafterSession, name, gameId, quantity, faceImageId, identity, isProofed):
    url = "%s/boxface" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        game_id = gameId,
        quantity = quantity,
        face_id = faceImageId,
        identity = identity,
        has_proofed_face = isProofed
    )

async def postTuckBox(gameCrafterSession, name, identity, quantity, gameId, imageId, isProofed):
    url = "%s/tuckbox" % (gameCrafterBaseUrl)
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        game_id = gameId,
        quantity = quantity,
        outside_id = imageId,
        identity = identity,
        has_proofed_outside = isProofed,
    )

async def postDeck(gameCrafterSession, name, identity, quantity, gameId, backImageFileId, isProofed):
    url = "%s/deck" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        game_id = gameId,
        identity = identity,
        quantity = quantity,
        back_id = backImageFileId,
        has_proofed_back = isProofed
    )

async def postDeckCard(gameCrafterSession, name, deckId, quantity, imageFileId, isProofed):
    url = "%s/card" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        deck_id = deckId,
        quantity = quantity,
        face_id = imageFileId,
        back_from = "Deck",
        has_proofed_face = isProofed,
        has_proofed_back = isProofed
    )

async def postTwoSidedBox(gameCrafterSession, cloudGameId, componentName, identity, quantity, topImageFileId, bottomImageFileId, isProofed):
    url = "%s/twosidedbox" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = componentName,
        game_id = cloudGameId,
        quantity = quantity,
        identity = identity,
        top_id = topImageFileId,
        has_proofed_top = isProofed,
        bottom_id = bottomImageFileId,
        has_proofed_bottom = isProofed
    )

async def postTwoSidedSluggedSet(gameCrafterSession, name, identity, quantity, gameId, backImageFileId, isProofed):
    url = "%s/twosidedsluggedset" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        game_id = gameId,
        identity = identity,
        quantity = quantity,
        back_id = backImageFileId,
        has_proofed_back = isProofed
    )

async def postTwoSidedSlugged(gameCrafterSession, name, setId, quantity, imageFileId, isProofed):
    url = "%s/twosidedslugged" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        set_id = setId,
        quantity = quantity,
        face_id = imageFileId,
        has_proofed_face = isProofed,
        has_proofed_back = isProofed
    )

async def postDownloadableDocument(gameCrafterSession, gameId, pdfFileId):
    url = "%s/gamedownload" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        game_id = gameId,
        file_id = pdfFileId,
        name = "rules.pdf"
    )

async def postDocument(gameCrafterSession, name, quantity, gameId, pdfFileId, isProofed):
    url = "%s/document" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        game_id = gameId,
        quantity = quantity,
        identity = "Document",
        pdf_id = pdfFileId,
        use_for = "Download"
    )

async def postCustomWoodenDie(gameCrafterSession, gameId, name, quantity, sideFileIds, isProofed):
 
    if len(sideFileIds) != 6:
        raise Exception("A D6 needs 6 sides, but only %s were given." % (len(sideFileIds)))
    
    url = "%s/customwoodd6" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        game_id = gameId,
        quantity = quantity,
        side1_id = sideFileIds[0],
        side2_id = sideFileIds[1],
        side3_id = sideFileIds[2],
        side4_id = sideFileIds[3],
        side5_id = sideFileIds[4],
        side6_id = sideFileIds[5],
        has_proofed_side1 = isProofed,
        has_proofed_side2 = isProofed,
        has_proofed_side3 = isProofed,
        has_proofed_side4 = isProofed,
        has_proofed_side5 = isProofed,
        has_proofed_side6 = isProofed,
    )

async def postCustomD4(gameCrafterSession, name, gameId, quantity, color, sideFileIds, isProofed):
 
    if len(sideFileIds) != 4:
        raise Exception("A D6 needs 4 sides, but only %s were given." % (len(sideFileIds)))
    
    url = "%s/customcolord4" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        game_id = gameId,
        quantity = quantity,
        diecolor = color,
        identity = "CustomColorD4",
        side1_id = sideFileIds[0],
        side2_id = sideFileIds[1],
        side3_id = sideFileIds[2],
        side4_id = sideFileIds[3],
        has_proofed_side1 = isProofed,
        has_proofed_side2 = isProofed,
        has_proofed_side3 = isProofed,
        has_proofed_side4 = isProofed
    )

async def postCustomD6(gameCrafterSession, name, gameId, quantity, color, sideFileIds, isProofed):
    if len(sideFileIds) != 6:
        raise Exception("A D6 needs 6 sides, but only %s were given." % (len(sideFileIds)))
    url = "%s/customcolord6" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        game_id = gameId,
        quantity = quantity,
        color = color,
        identity = "CustomColorD6",
        side1_id = sideFileIds[0],
        side2_id = sideFileIds[1],
        side3_id = sideFileIds[2],
        side4_id = sideFileIds[3],
        side5_id = sideFileIds[4],
        side6_id = sideFileIds[5],
        has_proofed_side1 = isProofed,
        has_proofed_side2 = isProofed,
        has_proofed_side3 = isProofed,
        has_proofed_side4 = isProofed,
        has_proofed_side5 = isProofed,
        has_proofed_side6 = isProofed,
    )

async def postCustomD8(gameCrafterSession, name, gameId, quantity, color, sideFileIds, isProofed):
 
    if len(sideFileIds) != 8:
        raise Exception("A D8 needs 8 sides, but only %s were given." % (len(sideFileIds)))
    
    url = "%s/customcolord8" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        game_id = gameId,
        quantity = quantity,
        color = color,
        identity = "CustomColorD8",
        side1_id = sideFileIds[0],
        side2_id = sideFileIds[1],
        side3_id = sideFileIds[2],
        side4_id = sideFileIds[3],
        side5_id = sideFileIds[4],
        side6_id = sideFileIds[5],
        side7_id = sideFileIds[6],
        side8_id = sideFileIds[7],
        has_proofed_side1 = isProofed,
        has_proofed_side2 = isProofed,
        has_proofed_side3 = isProofed,
        has_proofed_side4 = isProofed,
        has_proofed_side5 = isProofed,
        has_proofed_side6 = isProofed,
        has_proofed_side7 = isProofed,
        has_proofed_side8 = isProofed,
    )

async def getCustomPartInfo(gameCrafterSession):
    url = "%s/tgc/products" % (gameCrafterBaseUrl)
    return await httpClient.get(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId
    )

async def getStockPartInfo(gameCrafterSession, pageNumber=1):
    url = "%s/part?_page_number=%s" % (gameCrafterBaseUrl, pageNumber)
    return await httpClient.get(gameCrafterSession, url, 
        session_id = gameCrafterSession.sessionId,
    )

async def postOneSidedSluggedSet(gameCrafterSession, name, identity, quantity, gameId, isProofed):
    url = "%s/onesidedsluggedset" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        game_id = gameId,
        identity = identity,
        quantity = quantity
    )

async def postOneSidedSlugged(gameCrafterSession, name, setId, quantity, imageFileId, isProofed):
    url = "%s/onesidedslugged" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        set_id = setId,
        quantity = quantity,
        face_id = imageFileId,
        has_proofed_face = isProofed
    )

async def postCustomWoodD6(gameCrafterSession, name, gameId, quantity, sideFileIds, isProofed):
    if len(sideFileIds) != 6:
        raise Exception("A wooden D6 needs 6 sides, but only %s were given." % (len(sideFileIds)))
    
    url = "%s/customwoodd6" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        game_id = gameId,
        quantity = quantity,
        identity = "CustomWoodD6",
        side1_id = sideFileIds[0],
        side2_id = sideFileIds[1],
        side3_id = sideFileIds[2],
        side4_id = sideFileIds[3],
        side5_id = sideFileIds[4],
        side6_id = sideFileIds[5],
        has_proofed_side1 = isProofed,
        has_proofed_side2 = isProofed,
        has_proofed_side3 = isProofed,
        has_proofed_side4 = isProofed,
        has_proofed_side5 = isProofed,
        has_proofed_side6 = isProofed
    )

async def postTwoSidedBoxGloss(gameCrafterSession, cloudGameId, componentName, identity, quantity, topImageFileId, bottomImageFileId, isProofed):
    url = "%s/twosidedboxgloss" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = componentName,
        game_id = cloudGameId,
        quantity = quantity,
        identity = identity,
        top_id = topImageFileId,
        bottom_id = bottomImageFileId,
        has_proofed_top = isProofed,
        has_proofed_bottom = isProofed,
        surfacing_treatment = "gloss"
    )

async def postScorePad(gameCrafterSession, name, gameId, quantity, imageFileId, pageCount, identity, isProofed):
    url = "%s/scorepad" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        game_id = gameId,
        quantity = quantity,
        image_id = imageFileId,
        page_count = pageCount,
        has_proofed_image = isProofed,
        identity = identity
    )

async def postOneSided(gameCrafterSession, name, gameId, quantity, faceImageId, identity, isProofed):
    url = "%s/onesided" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        game_id = gameId,
        quantity = quantity,
        face_id = faceImageId,
        identity = identity,
        has_proofed_face = isProofed
    )

async def postOneSidedGloss(gameCrafterSession, name, gameId, quantity, faceImageId, identity, isProofed, spotGlossId=None):
    url = "%s/onesidedgloss" % gameCrafterBaseUrl
    params = {
        "session_id": gameCrafterSession.sessionId,
        "name": name,
        "game_id": gameId,
        "quantity": quantity,
        "face_id": faceImageId,
        "identity": identity,
        "has_proofed_face": isProofed,
        "surfacing_treatment": "gloss"
    }
    
    if spotGlossId:
        params.update({
            "spot_gloss_id": spotGlossId,
            "has_proofed_spot_gloss": isProofed,
            "surfacing_treatment": "spot_gloss"
        })
        
    return await httpClient.post(gameCrafterSession, url, **params)

async def postDial(gameCrafterSession, name, gameId, quantity, outsideImageId, identity, isProofed):
    url = "%s/dial" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        game_id = gameId,
        quantity = quantity,
        outside_id = outsideImageId,
        identity = identity, 
        has_proofed_outside = isProofed
    )

async def postCustomPrintedMeeple(gameCrafterSession, name, gameId, quantity, side1ImageId, side2ImageId, diecolor, isProofed):
    url = "%s/customprintedmeeple" % gameCrafterBaseUrl
    params = {
        "session_id": gameCrafterSession.sessionId,
        "name": name,
        "game_id": gameId,
        "quantity": quantity,
        "identity": "CustomPrintedMeeple",
        "diecolor": diecolor or "white",
        "has_proofed_side1": isProofed,
    }
    
    if side1ImageId:
        params["side1_id"] = side1ImageId
        
    if side2ImageId:
        params["side2_id"] = side2ImageId
        params["has_proofed_side2"] = isProofed
        
    return await httpClient.post(gameCrafterSession, url, **params)

async def postBoxTop(gameCrafterSession, name, gameId, quantity, topImageId, identity, isProofed):
    url = "%s/boxtop" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        game_id = gameId,
        quantity = quantity,
        top_id = topImageId,
        identity = identity,
        has_proofed_top = isProofed
    )

async def postBoxTopGloss(gameCrafterSession, name, gameId, quantity, topImageId, identity, isProofed, spotGlossId=None):
    url = "%s/boxtopgloss" % gameCrafterBaseUrl
    params = {
        "session_id": gameCrafterSession.sessionId,
        "name": name,
        "game_id": gameId,
        "quantity": quantity,
        "top_id": topImageId,
        "identity": identity,
        "has_proofed_top": isProofed,
        "surfacing_treatment": "gloss"
    }
    
    if spotGlossId:
        params.update({
            "spot_gloss_id": spotGlossId,
            "has_proofed_spot_gloss": isProofed,
            "surfacing_treatment": "spot_gloss"
        })
        
    return await httpClient.post(gameCrafterSession, url, **params)

async def postPerfectBoundBook(gameCrafterSession, name, gameId, quantity, identity, pageCount, spineImageId=None, isProofed=False):
    url = "%s/perfectboundbook" % gameCrafterBaseUrl
    params = {
        "session_id": gameCrafterSession.sessionId,
        "name": name,
        "game_id": gameId,
        "quantity": quantity,
        "identity": identity,
        "page_count": pageCount
    }
    
    if spineImageId:
        params.update({
            "spine_image_id": spineImageId,
            "has_proofed_spine": isProofed
        })
        
    return await httpClient.post(gameCrafterSession, url, **params)

async def postPerfectBoundBookPage(gameCrafterSession, name, bookletId, sequenceNumber, imageId, isProofed):
    url = "%s/perfectboundbookpage" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        booklet_id = bookletId,
        sequence_number = sequenceNumber,
        image_id = imageId,
        has_proofed_image = isProofed
    )

async def postCoilBook(gameCrafterSession, name, gameId, quantity, identity, pageCount, isProofed):
    url = "%s/coilbook" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        game_id = gameId,
        quantity = quantity,
        identity = identity,
        page_count = pageCount
    )

async def postCoilBookPage(gameCrafterSession, name, coilbookId, sequenceNumber, imageId, isProofed):
    url = "%s/coilbookpage" % gameCrafterBaseUrl
    return await httpClient.post(gameCrafterSession, url,
        session_id = gameCrafterSession.sessionId,
        name = name,
        coilbook_id = coilbookId,
        sequence_number = sequenceNumber,
        image_id = imageId,
        has_proofed_image = isProofed
    )