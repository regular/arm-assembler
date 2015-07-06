arm-assembler
===
turn arm32 assembler instructions into binary machine-code

Prerequisistes
---

You need to have the [arm-eabi-toolchain installed](http://blog.y3xz.com/blog/2012/10/07/setting-up-an-arm-eabi-toolchain-on-mac-os-x)

Usage
---
``` javascript
var through = require('through');
var test = require('tape');
var asm = require('.');

test('shoudl assemble single instruction when given a string', function(t) {
    t.plan(4);
    asm('MOVEQ r0, r1, LSL r2', function(err, i) {
        t.equal(err, null);
        t.equal(i.toString(16), '1a00211');
    });
    asm('MOV r0, r1, LSL r2', function(err, i) {
        t.equal(err, null);
        t.equal(i.toString(16), 'e1a00211');
    });
});

test('shoudl return stream when given a stream', function(t) {
    var tr = through();
    var out = asm(tr);
    var i = 0;
    t.plan(3);
    out.on('data', function(data) {
        if (i===0) {
            t.equal(data.toString(16), '1a00211');
            i++;
        } else {
            t.equal(data.toString(16), 'e1a00211');
            i++;
        }
    }).on('end', function() {
        t.equal(i,2);
    });

    tr.write('MOVEQ r0, r1, LSL r2');
    tr.write('MOV r0, r1, LSL r2');
    tr.end();
});
```
