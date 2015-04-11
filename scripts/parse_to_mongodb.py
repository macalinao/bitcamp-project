from pymongo import MongoClient
import os
import xmltodict

client = MongoClient(os.environ['MONGODB_URI'])
col = client.get_default_database().iapds

def chunks(l, n):
    for i in xrange(0, len(l), n):
        yield l[i:i+n]

for x in xrange(1, 4):
    filename = './data/IA_Indvl_Feeds' + str(x) + '.xml'
    print 'Parsing ' + filename + '...'
    res = xmltodict.parse(open(filename))
    indvls = res['IAPDIndividualReport']['Indvls']['Indvl']
    print 'Parsed! Inserting data...'

    ct = 0
    for c in chunks(indvls, 5):
        print 'Inserting chunk ' + str(ct)
        col.insert_many(c)
        ct += 1

    print 'Inserted ' + filename + '.'
