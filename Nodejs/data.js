var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    nodemailer = require('nodemailer'),
    jwt = require('jsonwebtoken'),
    ObjectId = require('mongodb').ObjectID,
    _ = require('underscore');

var client = nodemailer.createTransport({
    service: 'Godaddy',
    auth: {
        user: 'christson@proficientts.com',
        pass: 'Fl)w3rd3nv3r'
    }
});

function ItemDAO(database) {
    "use strict";
    this.db = database;
    this.listItem = function(id, type, type2, name, view, callback) {
        "use strict";
        console.log("List Data ID")
        console.log(id)
        var cursor = this.db.collection(type).find({});
        var query = {},
            project;
        var aggr = [];

        switch (type) {
            case 'part':
                if (id) {
                    query = { part_id: id, voidfl: { $ne: 'Y' } };
                } else if (name) {
                    aggr = [{ $match: { $or: [{ part_nm: { $regex: name, $options: 'i' } }, { part_id: { $regex: name, $options: 'i' } }], voidfl: { $ne: 'Y' } } }, { $project: { _id: 0, ID: "$part_id", Name: "$part_nm", img: 1 } }, { $sort: { part_nm: 1 } }];
                } else {
                    aggr = [{ $project: { _id: 0, ID: "$part_id", Name: "$part_nm", img: 1 } }, { $sort: { part_nm: 1 } }];
                }

                break;
            case 'set':
                if (id) {
                    query = { set_id: id, voidfl: { $ne: 'Y' } };
                } else if (name) {
                    aggr = [{ $match: { $or: [{ set_nm: { $regex: name, $options: 'i' } }, { set_id: { $regex: name, $options: 'i' } }], voidfl: { $ne: 'Y' } } }, { $project: { _id: 0, ID: "$set_id", Name: "$set_nm", img: 1 } }, { $sort: { set_nm: 1 } }];
                } else {
                    aggr = [{ $project: { _id: 0, ID: "$set_id", Name: "$set_nm", img: 1 } }, { $sort: { set_nm: 1 } }];
                }
                break;
            case 'system':
                if (id) {
                    query = { system_id: id, voidfl: { $ne: 'Y' } };
                } else if (name) {
                    aggr = [{ $match: { $or: [{ system_nm: { $regex: name, $options: 'i' } }, { system_id: { $regex: name, $options: 'i' } }], voidfl: { $ne: 'Y' } } }, { $project: { _id: 0, ID: "$system_id", Name: "$system_nm", img: 1 } }, { $sort: { system_nm: 1 } }];
                } else {
                    aggr = [{ $project: { _id: 0, ID: "$system_id", Name: "$system_nm", img: 1 } }, { $sort: { system_nm: 1 } }];
                }
                break;
            case 'technique':
                if (view === "display") {
                    query = { technique_nm: id, voidfl: { $ne: 'Y' } };
                } else if (name) {
                    aggr = [{ $match: { technique_nm: { $regex: name, $options: 'i' }, voidfl: { $ne: 'Y' } } }, { $project: { _id: 0, Name: "$technique_nm" } }, { $sort: { technique_nm: 1 } }];
                } else if (type2) {
                    type = type2;
                    switch (type2) {
                        case "system":
                            aggr = [{ $match: { "technique.technique_nm": id, voidfl: { $ne: 'Y' } } }, { $project: { _id: 0, ID: "$system_id", Name: "$system_nm", img: 1 } }, { $sort: { system_nm: 1 } }];
                            break;
                    }
                } else {
                    aggr = [{ $project: { _id: 0, Name: "$technique_nm" } }, { $sort: { technique_nm: 1 } }];
                }
                break;
        }
        console.log("Query -------------")
        console.log(query)
        console.log(project)
        console.log(aggr)

        var cursor = this.db.collection(type).find(query);
        if (view === "list") {
            cursor = this.db.collection(type).aggregate(aggr);
        }
        cursor.toArray(
            function(err, doc) {
                assert.equal(err, null);
                console.log("Type List Result")
                    // console.log(doc)
                callback(doc);
            }
        );
    }

    this.listByKeyword = function(name, callback) {
        "use strict";
        var that = this;
        var rst = {};
        var name = new RegExp(name);
        this.db.collection('system').aggregate([{ $match: { $or: [{ system_nm: { $regex: name, $options: 'i' } }, { system_id: { $regex: name, $options: 'i' } }], voidfl: { $ne: 'Y' } } }, { $project: { _id: 0, ID: "$system_id", Name: "$system_nm", img: 1 } }, { $sort: { system_nm: 1 } }]).toArray(
            function(err, system) {
                assert.equal(err, null);
                console.log("System List Result");
                if (err)
                    callback(false, err);
                else {
                    console.log(system);
                    rst.system = system;

                    that.db.collection('file').find({ file_type: "img", "title": { $regex: name, $options: 'i' } }).sort({ title: 1 }).toArray(
                        function(err, image) {
                            assert.equal(err, null);
                            console.log("Img List Result");
                            if (err)
                                callback(false, err);
                            else {
                                rst.img = _.uniq(image);
                                that.db.collection('file').find({ file_type: "video", "title": { $regex: name, $options: 'i' } }).sort({ title: 1 }).toArray(
                                    function(err, video) {
                                        assert.equal(err, null);
                                        console.log("Video List Result");
                                        if (err)
                                            callback(false, err);
                                        else {
                                            rst.video = _.uniq(video);
                                            that.db.collection('file').find({ file_type: "doc", "title": { $regex: name, $options: 'i' } }).sort({ title: 1 }).toArray(
                                                function(err, doc) {
                                                    assert.equal(err, null);
                                                    console.log("Doc List Result");
                                                    if (err)
                                                        callback(false, err);
                                                    else {
                                                        rst.doc = _.uniq(doc);
                                                        that.db.collection('set').aggregate([{ $match: { $or: [{ set_nm: { $regex: name, $options: 'i' } }, { set_id: { $regex: name, $options: 'i' } }], voidfl: { $ne: 'Y' } } }, { $project: { _id: 0, ID: "$set_id", Name: "$set_nm", img: 1 } }, { $sort: { set_nm: 1 } }]).toArray(
                                                            function(err, set) {
                                                                assert.equal(err, null);
                                                                console.log("Set List Result");
                                                                if (err)
                                                                    callback(false, err);
                                                                else {
                                                                    rst.set = set;
                                                                    that.db.collection('part').aggregate([{ $match: { $or: [{ part_nm: { $regex: name, $options: 'i' } }, { part_id: { $regex: name, $options: 'i' } }], voidfl: { $ne: 'Y' } } }, { $project: { _id: 0, ID: "$part_id", Name: "$part_nm", img: 1 } }, { $sort: { part_nm: 1 } }]).toArray(
                                                                        function(err, part) {
                                                                            assert.equal(err, null);
                                                                            console.log("Part List Result");
                                                                            if (err)
                                                                                callback(false, err);
                                                                            else {
                                                                                rst.part = part;
                                                                                callback(true, rst)
                                                                            }
                                                                        }
                                                                    );
                                                                }
                                                            }
                                                        );
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        );
    }

    this.fnFullSync = function(syncInfo, callback) {
        "use strict";
        var that = this;
        var rst = {};
        var startTM, endTM;
        startTM = Number(new Date());
        console.log(startTM);
        this.db.collection('part').find({ voidfl: { $ne: 'Y' } }).snapshot().toArray(
            function(err, part) {
                console.log("new Date -------------------------------------------------------------------");
                console.log(new Date);
                assert.equal(err, null);
                console.log("Part Sync Result")
                console.log(part)
                rst.part = part;
                that.db.collection('set').find({ voidfl: { $ne: 'Y' } }).snapshot().toArray(
                    function(err, set) {
                        console.log("new Date -------------------------------------------------------------------");
                        console.log(new Date);
                        assert.equal(err, null);
                        console.log("Set Sync Result")
                        console.log(set)
                        rst.set = set;
                        that.db.collection('system').find({ voidfl: { $ne: 'Y' } }).snapshot().toArray(
                            function(err, system) {
                                console.log("new Date -------------------------------------------------------------------");
                                console.log(new Date);
                                assert.equal(err, null);
                                console.log("System Sync Result")
                                console.log(system)
                                rst.system = system;
                                that.db.collection('technique').find({ voidfl: { $ne: 'Y' } }).snapshot().toArray(
                                    function(err, technique) {
                                        endTM = Number(new Date());
                                        console.log(endTM);
                                        console.log("new Date -------------------------------------------------------------------");
                                        console.log(new Date);
                                        assert.equal(err, null);
                                        console.log("Technique Sync Result")
                                        console.log(technique)
                                        rst.technique = technique;
                                        that.db.collection('file').find({ voidfl: { $ne: 'Y' } }).snapshot().toArray(
                                            function(err, file) {
                                                endTM = Number(new Date());
                                                console.log(endTM);
                                                console.log("new Date -------------------------------------------------------------------");
                                                console.log(new Date);
                                                assert.equal(err, null);
                                                console.log("File Sync Result")
                                                console.log(file)
                                                rst.file = file;
                                                console.log(rst);
                                                var devSync = that.DevSyncInfo(syncInfo, startTM, endTM);
                                                console.log(devSync);
                                                that.db.collection('devicesync').findAndModify({ deviceID: devSync.deviceID, email: devSync.email, voidfl: { $ne: 'Y' } }, [
                                                    ['deviceID', 'asc']
                                                ], devSync, { upsert: true }, function(err, final) {
                                                    assert.equal(err, null);
                                                    console.log("final Result")
                                                    console.log(final);
                                                    callback(rst);
                                                });
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    }

    this.updateSync = function(syncInfo, callback) {
        "use strict";
        var that = this;
        var rst = {};
        var updateTM = Number(new Date());
        console.log("updateTM ----------- updateTM -------------- updateTM");
        console.log(updateTM);
        this.db.collection('devicesync').find({ email: syncInfo.email, deviceID: syncInfo.deviceID, voidfl: { $ne: 'Y' } }, { _id: 0, startTM: 1 }).toArray(
            function(err, doc) {
                assert.equal(err, null);
                console.log("Device Sync startTM Fetch Result")
                    // console.log(doc)
                    // callback(doc);
                if (doc.length) {
                    // callback(doc)
                    console.log(doc[0].startTM);
                    // gte start time only, since we are taking snapshot! 
                    that.db.collection('mastersync').find({ updateTM: { $gte: doc[0].startTM }, voidfl: { $ne: 'Y' } }).toArray(
                        function(err, mstrst) {
                            assert.equal(err, null);
                            console.log("Updates in Master Sync Fetch Result")
                            console.log(mstrst);
                            if (mstrst.length) {

                                var part = mstrst.filter(function(o) {
                                    return o.reftype == 'part'
                                })
                                var partID = [],
                                    partVd = [];
                                for (var i = 0; i < part.length; i++) {
                                    partID.push(ObjectId(part[i].refid));
                                    if (part[i].action == "Y") {
                                        partVd.push({ _id: part[i].refid, voidfl: "Y" })
                                    }
                                }
                                var set = mstrst.filter(function(o) {
                                    return o.reftype == 'set'
                                })
                                var setID = [],
                                    setVd = [];
                                for (var i = 0; i < set.length; i++) {
                                    setID.push(ObjectId(set[i].refid));
                                    if (set[i].action == "Y") {
                                        setVd.push({ _id: set [i].refid, voidfl: "Y" })
                                    }
                                }
                                var system = mstrst.filter(function(o) {
                                    return o.reftype == 'system'
                                })
                                var systemID = [],
                                    systemVd = [];
                                for (var i = 0; i < system.length; i++) {
                                    systemID.push(ObjectId(system[i].refid));
                                    if (system[i].action == "Y") {
                                        systemVd.push({ _id: system[i].refid, voidfl: "Y" })
                                    }
                                }
                                var technique = mstrst.filter(function(o) {
                                    return o.reftype == 'technique'
                                })
                                var techniqueID = [],
                                    techniqueVd = [];
                                for (var i = 0; i < technique.length; i++) {
                                    techniqueID.push(ObjectId(technique[i].refid));
                                    if (technique[i].action == "Y") {
                                        techniqueVd.push({ _id: technique[i].refid, voidfl: "Y" })
                                    }
                                }
                                var file = mstrst.filter(function(o) {
                                    return o.reftype == 'file'
                                })
                                var fileID = [],
                                    fileVd = [];
                                for (var i = 0; i < file.length; i++) {
                                    fileID.push(ObjectId(file[i].refid));
                                    if (file[i].action == "Y") {
                                        fileVd.push({ _id: file[i].refid, voidfl: "Y" })
                                    }
                                }
                                // Array.prototype.push.apply(arr1,arr2);
                                that.db.collection('part').find({ _id: { $in: partID }, voidfl: { $ne: 'Y' } }).snapshot().toArray(
                                    function(err, part) {
                                        assert.equal(err, null);
                                        rst.part = part;
                                        Array.prototype.push.apply(rst.part, partVd);
                                        that.db.collection('set').find({ _id: { $in: setID }, voidfl: { $ne: 'Y' } }).snapshot().toArray(
                                            function(err, set) {
                                                assert.equal(err, null);
                                                rst.set = set;
                                                Array.prototype.push.apply(rst.set, setVd);
                                                that.db.collection('system').find({ _id: { $in: systemID }, voidfl: { $ne: 'Y' } }).snapshot().toArray(
                                                    function(err, system) {
                                                        assert.equal(err, null);
                                                        rst.system = system;
                                                        Array.prototype.push.apply(rst.system, systemVd);
                                                        that.db.collection('technique').find({ _id: { $in: techniqueID }, voidfl: { $ne: 'Y' } }).snapshot().toArray(
                                                            function(err, technique) {
                                                                assert.equal(err, null);
                                                                rst.technique = technique;
                                                                Array.prototype.push.apply(rst.technique, techniqueVd);
                                                                that.db.collection('file').find({ _id: { $in: fileID }, voidfl: { $ne: 'Y' } }).snapshot().toArray(
                                                                    function(err, file) {
                                                                        assert.equal(err, null);
                                                                        rst.file = file;
                                                                        Array.prototype.push.apply(rst.file, fileVd);
                                                                        var endTM;
                                                                        endTM = Number(new Date());
                                                                        console.log(endTM);
                                                                        // callback(rst);
                                                                        var devSync = that.DevSyncInfo(syncInfo, updateTM, endTM);
                                                                        console.log(devSync);
                                                                        console.log(devSync.deviceID + "------------------ deviceID");
                                                                        that.db.collection('devicesync').findAndModify({ deviceID: devSync.deviceID, email: devSync.email, voidfl: { $ne: 'Y' } }, [
                                                                            ['_id', 'asc']
                                                                        ], devSync, { upsert: true }, function(err, data) {
                                                                            assert.equal(err, null);
                                                                            callback(rst);
                                                                        });
                                                                    }
                                                                );
                                                            }
                                                        );
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );
                            } else {
                                var endTM;
                                endTM = Number(new Date());
                                console.log(endTM);
                                // callback(rst);
                                var devSync = that.DevSyncInfo(syncInfo, updateTM, endTM);
                                console.log(devSync);
                                console.log(devSync.deviceID + "------------------ deviceID");
                                that.db.collection('devicesync').findAndModify({ deviceID: devSync.deviceID, email: devSync.email, voidfl: { $ne: 'Y' } }, [
                                    ['deviceID', 'asc']
                                ], devSync, { upsert: true }, function(err, data) {
                                    assert.equal(err, null);
                                    callback({});
                                });
                            }
                        }
                    );


                } else {
                    callback({ full: "Y" });
                }
            }
        );
    }

    this.updateMaster = function(info, callback) {
        "use strict";

        this.db.collection('mastersync').findAndModify({ refid: info.refid, reftype: info.reftype, voidfl: { $ne: 'Y' } }, [
            ['_id', 'asc']
        ], info, { upsert: true }, function(err, rst) {
            assert.equal(err, null);
            console.log("master sync Result")
            callback(rst);
        });
    }

    this.DevSyncInfo = function(DevSyncInfo, s, e) {
        "use strict";

        var devSync = {
            email: DevSyncInfo.email,
            deviceID: DevSyncInfo.deviceID,
            startTM: s,
            endTM: e,
            voidFl: ''
        };

        return devSync;
    }

    this.MasterSyncInfo = function(id, typ, afl) {
        "use strict";
        var updateTM = Number(new Date());

        var MasterSync = {
            refid: id,
            updateTM: updateTM,
            reftype: typ,
            action: afl,
            voidFl: ''
        };

        return MasterSync;
    }
}

function mergeByProperty(arr1, arr2, prop) {
    _.each(arr2, function(arr2obj) {
        var arr1obj = _.find(arr1, function(arr1obj) {
            return arr1obj[prop] === arr2obj[prop];
        });

        arr1obj ? _.extend(arr1obj, arr2obj) : arr1.push(arr2obj);
    });
}

module.exports.ItemDAO = ItemDAO;