from pymongo import MongoClient
import xmltodict

client = MongoClient()
col = client.bitcamp.iapds

for x in xrange(1, 21):
    filename = './data/IA_Indvl_Feeds' + str(x) + '.xml'
    print 'Parsing ' + filename + '...'
    res = xmltodict.parse(open(filename))
    indvls = res['IAPDIndividualReport']['Indvls']['Indvl']
    col.insert_many(indvls)
    print 'Inserted ' + filename + '.'
