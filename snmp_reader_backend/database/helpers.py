from bson.json_util import dumps
import json

def parseJson(object):
    tmp = dumps(object)
    return json.loads(tmp)
