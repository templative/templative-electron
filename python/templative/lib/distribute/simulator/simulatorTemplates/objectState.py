def createDeckObjectState(guid, name, faceUrl, backUrl, count, columnCount, rowCount):
    deckIds = []
    for i in range(0,count):
        print(i)
        deckIds.append(int("1%s" % i))
    print(deckIds)
    return {
      "Name": "Deck",
      "Transform": {
        "posX": 0,
        "posY": 1.5,
        "posZ": 0,
        "rotX": 0,
        "rotY": 0,
        "rotZ": 0,
        "scaleX": 1.75580585,
        "scaleY": 1.0,
        "scaleZ": 1.75580585
      },
      "Nickname": name,
      "Description": "",
      "ColorDiffuse": {
        "r": 0.7132782,
        "g": 0.7132782,
        "b": 0.7132782
      },
      "Locked": False,
      "Grid": True,
      "Snap": True,
      "Autoraise": True,
      "Sticky": True,
      "SidewaysCard": False,
      "DeckIDs": deckIds,
      "CustomDeck": {
        "1": {
          "FaceURL": faceUrl,
          "BackURL": backUrl,
          "NumWidth": columnCount,
          "NumHeight": rowCount
        }
      },
      "GUID": guid
    }