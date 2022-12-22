let bunny_eye_open, bunny_eye_close, amount = 8;

async function AmmoPhysics() {
    if ("Ammo" in window == !1) return void console.error("AmmoPhysics: Couldn't find Ammo.js");
    let e, t;
    const n = 2, o = await Ammo(), a = new o.btDefaultCollisionConfiguration(), s = new o.btCollisionDispatcher(a), r = new o.btDbvtBroadphase(), i = new o.btSequentialImpulseConstraintSolver(), l = new o.btDiscreteDynamicsWorld(s, r, i, a);
    l.setGravity(new o.btVector3(0, -10, 0));
    let d = new o.btTransform();
    const c = new o.btTransform();
    let h, E = new o.btVector3(0, 0, 0), u = new o.btQuaternion(0, 0, 0, 0);
    function m(e) {
        let t = null;
        E.setValue(0, 0, 0);
        let n = e.attributes.position.array;
        t = new Ammo.btConvexHullShape();
        for (let e = 0, o = n.length; e < o; e += 3) {
            E.setValue(n[e], n[e + 1], n[e + 2]);
            const a = e >= o - 3;
            t.addPoint(E, a);
        }
        return t && t.setMargin(0), t || console.error("AmmoPhysics: Shape error."), t;
    }
    let w = [], p = new WeakMap();
    let y, R = null, T = "";
    function f(e, t, a, s = null) {
        h = e.position, u = e.quaternion, d.setIdentity(), E.setValue(h.x, h.y, h.z), d.setOrigin(E), 
        d.setRotation(new o.btQuaternion(u.x, u.y, u.z, u.w));
        const r = e.scale;
        E.setValue(r.x, r.y, r.z), a.setLocalScaling(E), E.setValue(0, 0, 0);
        const i = new o.btDefaultMotionState(d), c = E;
        t > 0 && a.calculateLocalInertia(t, c);
        const m = new o.btRigidBodyConstructionInfo(t, i, a, c), y = new o.btRigidBody(m);
        "floor" == e.name ? (y.setFriction(.2), y.setRestitution(.8), y.setDamping(0, 0)) : "snowman" == e.name ? (y.setFriction(.8), 
        y.setRestitution(.1), y.setDamping(0, .8)) : "bunny" == e.name || "leg_l" == e.name || "leg_r" == e.name ? (y.setFriction(1), 
        y.setRollingFriction(1), y.setRestitution(0), y.setDamping(0, 0)) : (y.setFriction(.5), 
        y.setRestitution(.5), y.setDamping(0, .8)), "shootingBall" == e.name && s && (y.setRestitution(.2), 
        y.setDamping(0, 0), E.setValue(s.x, s.y, s.z), y.setLinearVelocity(E)), "leg_l" != e.name && "leg_r" != e.name || (y.setActivationState(4), 
        y.setCollisionFlags(n)), y.name = e.name, l.addRigidBody(y), (t > 0 || y.getCollisionFlags() == n) && (w.push(e), 
        p.set(e, y));
    }
    const H = function() {
        bunny_eye_open.visible = !0, bunny_eye_close.visible = !1;
    };
    let M = 0;
    const g = -10;
    return setInterval(function() {
        const a = performance.now();
        if (M > 0) {
            const e = (a - M) / 1e3;
            l.stepSimulation(e, 10);
        }
        M = a;
        for (let a = 0, s = w.length; a < s; a++) {
            if (!w[a]) continue;
            let s = w[a];
            if (s.isInstancedMesh) {
                let t = s.instanceMatrix.array;
                if (!p.has(s)) continue;
                let n = p.get(s);
                for (let o = 0; o < n.length; o++) if (n[o]) {
                    if (n[o].getMotionState().getWorldTransform(c), (h = c.getOrigin()).y() < g) {
                        let t = THREE.MathUtils.randFloat(-e / 2, e / 2), a = 9, s = THREE.MathUtils.randFloat(-e / 2, e / 2);
                        E.setValue(t, a, s), c.setIdentity(), c.setOrigin(E), n[o].setWorldTransform(c), 
                        E.setValue(0, 0, 0), n[o].setLinearVelocity(E), n[o].setAngularVelocity(E), n[o].clearForces(), 
                        h.setValue(t, a, s), u.setValue(0, 0, 0, 0);
                    } else u = c.getRotation();
                    compose(h, u, t, 16 * o);
                }
                p.set(s, n), s.instanceMatrix.needsUpdate = !0;
            } else if (s.isMesh) {
                if (!p.has(s)) continue;
                const r = p.get(s);
                if (r.getMotionState().getWorldTransform(c), (h = c.getOrigin()).y() < 1.5 * g && "snowman" == s.name) {
                    let t = THREE.MathUtils.randFloat(-e / 2, e / 2), n = 13, o = THREE.MathUtils.randFloat(-e / 2, e / 2);
                    E.setValue(t, n, o), c.setIdentity(), c.setOrigin(E), r.setWorldTransform(c), E.setValue(0, 0, 0), 
                    r.setLinearVelocity(E), r.setAngularVelocity(E), r.clearForces(), u.setValue(0, 0, 0, 0), 
                    s.position.set(t, n, o);
                } else {
                    if (h.y() < g && "shootingBall" == s.name) {
                        s.material.dispose(), s.geometry.dispose(), t.remove(s), l.removeRigidBody(r), p.delete(s), 
                        w[a] = null, s = null;
                        continue;
                    }
                    r.getCollisionFlags() == n ? (u = s.quaternion, u = new o.btQuaternion(u.x, u.y, u.z, u.w), 
                    c.setRotation(u), r.setWorldTransform(c), r.getMotionState().setWorldTransform(c)) : (u = c.getRotation(), 
                    s.position.set(h.x(), h.y(), h.z()));
                }
                s.quaternion.set(u.x(), u.y(), u.z(), u.w());
            }
        }
        !function() {
            let e = l.getDispatcher(), t = e.getNumManifolds();
            const n = [ "bunny", "leg_r", "leg_l" ];
            for (let o = 0; o < t; o++) {
                let t, a = e.getManifoldByIndexInternal(o), s = Ammo.castObject(a.getBody0(), Ammo.btRigidBody), r = Ammo.castObject(a.getBody1(), Ammo.btRigidBody), i = s.name, l = r.name;
                if (!i || !l) continue;
                if (n.includes(i) && "shootingBall" == l) t = r; else {
                    if ("shootingBall" != i || !n.includes(l)) continue;
                    t = s;
                }
                let d = a.getNumContacts();
                for (let e = 0; e < d; e++) {
                    let t = a.getContactPoint(e), n = t.getAppliedImpulse();
                    n <= .1 || (bunny_eye_open.visible = !1, bunny_eye_close.visible = !0, clearTimeout(y), 
                    y = setTimeout(H, 800));
                }
            }
        }();
    }, 1e3 / 60), {
        addMesh: function(e, t = 0) {
            const n = m(e.geometry);
            if (!n) return console.error("AmmoPhysics: Shape is NULL."), !1;
            f(e, t, n);
        },
        addCompoundMesh: function(e, t = 0, n = []) {
            let a = new o.btCompoundShape();
            for (let e = 0; e < n.length; e++) {
                let t = m(n[e]);
                if (!t) return console.error("AmmoPhysics: Shape is NULL."), !1;
                E.setValue(0, 0, 0), d.setIdentity(), d.setOrigin(E), a.addChildShape(d, t);
            }
            f(e, t, a);
        },
      
   
        init: function(n = 10, o) {
            e = n, t = o;
        }
    };
}

function compose(e, t, n, o) {
    const a = t.x(), s = t.y(), r = t.z(), i = t.w(), l = a + a, d = s + s, c = r + r, h = a * l, E = a * d, u = a * c, m = s * d, w = s * c, p = r * c, y = i * l, R = i * d, T = i * c;
    n[o + 0] = 1 - (m + p), n[o + 1] = E + T, n[o + 2] = u - R, n[o + 3] = 0, n[o + 4] = E - T, 
    n[o + 5] = 1 - (h + p), n[o + 6] = w + y, n[o + 7] = 0, n[o + 8] = u + R, n[o + 9] = w - y, 
    n[o + 10] = 1 - (h + m), n[o + 11] = 0, n[o + 12] = e.x(), n[o + 13] = e.y(), n[o + 14] = e.z(), 
    n[o + 15] = 1;
}

!function() {
    "use strict";
    let e, t, n, o, a, s, r, i, l, d, c, h, E = [], u = [];
    const m = 7;
    let w, p;
    const y = Math.PI / 12, R = new THREE.Matrix4(), T = new THREE.Vector3(), f = (new THREE.Euler(), 
    new THREE.Quaternion()), H = new THREE.Vector3(1, 1, 1), M = function(e) {
        T.x = THREE.MathUtils.randFloat(-m / 2, m / 2), T.y = THREE.MathUtils.randFloat(m / 4, 2.5 * m), 
        T.z = THREE.MathUtils.randFloat(-m / 2, m / 2), e.compose(T, f, H);
    }, g = window.innerWidth < window.innerHeight;
    function b() {
        e.aspect = window.innerWidth / window.innerHeight, e.updateProjectionMatrix(), n.setSize(window.innerWidth, window.innerHeight);
    }
    function G() {
        requestAnimationFrame(G);
        const a = .01 * Date.now();
        p.rotation.x = -Math.abs(Math.cos(.22 * a)) * y, w.rotation.x = -Math.abs(Math.sin(.22 * a)) * y, 
        o.update(), n.render(t, e);
    }
    !async function() {
        const y = document.createElement("div");
        document.body.appendChild(y), (t = new THREE.Scene()).background = 0, (n = new THREE.WebGLRenderer({
            antialias: !0
        })).setPixelRatio(window.devicePixelRatio), n.setSize(window.innerWidth, window.innerHeight), 
        n.outputEncoding = THREE.sRGBEncoding, n.shadowMap.enabled = !0, y.appendChild(n.domElement), 
        e = new THREE.PerspectiveCamera(56, window.innerWidth / window.innerHeight, .01, 500), 
        g ? e.position.set(0, 4, 10) : e.position.set(0, 3, 7.5);
        e.lookAt(0, 0, 0);
        const T = new THREE.HemisphereLight(16777215, 0, .3);
        t.add(T);
        const f = new THREE.SpotLight(16777215, 1, 18, Math.PI / 7, 1, .5);
        f.position.set(0, 10, 5), f.target.position.set(0, 0, 0), f.target.updateMatrixWorld(), 
        f.castShadow = !0, t.add(f);
        new THREE.SpotLightHelper(f);
        let H = new THREE.Mesh(new THREE.SphereGeometry(50, 4, 4), new THREE.MeshBasicMaterial({
            color: "royalblue",
            side: THREE.BackSide
        }));
        t.add(H), (a = await AmmoPhysics()).init(m, t), E = [], r = new THREE.MeshLambertMaterial({
            color: "forestgreen"
        }), (s = new THREE.CylinderGeometry(1, 1.7, 1, 6)).translate(0, 2.5, 0), E.push(s), 
        (s = new THREE.CylinderGeometry(.7, 1.5, 1, 6)).translate(0, 3.5, 0), E.push(s), 
        (s = new THREE.CylinderGeometry(0, 1.2, 2, 6)).translate(0, 5, 0), E.push(s), s = THREE.BufferGeometryUtils.mergeBufferGeometries(E);
        const S = new THREE.Mesh(s, r);
        S.castShadow = !0, S.receiveShadow = !0, (s = new THREE.CylinderGeometry(.3, .3, 3, 8)).translate(0, 1.5, 0), 
        E.push(s), (r = r.clone()).color.set("saddlebrown");
        const C = new THREE.Mesh(s, r);
        C.castShadow = !0, C.receiveShadow = !0, S.add(C), S.position.set(-2, -.3, -3), 
        t.add(S), a.addCompoundMesh(S, 0, E);
        let P = S.clone();
        P.position.set(3, -.7, -5), P.scale.set(1.3, 1.3, 1.3), t.add(P), a.addCompoundMesh(P, 0, E), 
        r = new THREE.MeshLambertMaterial({
            color: "snow"
        }), E = [], (s = new THREE.SphereGeometry(1, 10, 10)).translate(0, 1, 0), E.push(s);
        let I = new THREE.Mesh(s, r);
        u = [];
        (s = new THREE.TorusGeometry(.45, .2, 8, 15)).rotateX(Math.PI / 2);
        let B = s.clone();
        s.translate(0, 2, 0), E.push(s), u.push(s), (s = new THREE.CylinderGeometry(.07, .17, .7, 6)).rotateZ(Math.PI / 4), 
        s.translate(.7, 1.88, 0), u.push(s), s = THREE.BufferGeometryUtils.mergeBufferGeometries(u), 
        (r = r.clone()).color.set("red"), h = new THREE.Mesh(s, r), I.add(h), u = [], (s = new THREE.CylinderGeometry(.08, .05, 1, 6)).rotateZ(Math.PI / 3), 
        s.translate(1, 1.3, 0), E.push(s), u.push(s), (s = new THREE.CylinderGeometry(.08, .05, 1, 6)).rotateZ(-Math.PI / 3), 
        s.translate(-1, 1.3, 0), E.push(s), u.push(s), s = THREE.BufferGeometryUtils.mergeBufferGeometries(u), 
        (r = r.clone()).color.set("saddlebrown"), d = new THREE.Mesh(s, r), I.add(d), (s = new THREE.SphereGeometry(.6, 10, 10)).translate(0, 2.5, 0), 
        E.push(s), (r = r.clone()).color.set("snow");
        let v = new THREE.Mesh(s, r);
        I.add(v), (s = new THREE.CylinderGeometry(.02, .1, .3, 6)).rotateX(Math.PI / 2), 
        s.translate(0, 2.5, .7), E.push(s), (r = r.clone()).color.set("orangered");
        let x = new THREE.Mesh(s, r);
        I.add(x), (s = new THREE.CylinderGeometry(0, .35, .7, 6)).rotateZ(-Math.PI / 10), 
        s.translate(.25, 3.35, 0), E.push(s), (r = r.clone()).color.set("red");
        let _ = new THREE.Mesh(s, r);
        I.add(_), (s = new THREE.SphereGeometry(.14, 6, 6)).translate(.33, 3.6, 0), E.push(s), 
        (r = r.clone()).color.set("orange");
        let A = new THREE.Mesh(s, r);
        I.add(A), u = [], (s = new THREE.SphereGeometry(.08, 10, 10)).translate(-.32, .7 + 1.9, .4), 
        u.push(s), (s = s.clone()).translate(.64, 0, 0), u.push(s), s = THREE.BufferGeometryUtils.mergeBufferGeometries(u), 
        (r = r.clone()).color.set("black"), c = new THREE.Mesh(s, r), I.add(c), (s = new THREE.TorusGeometry(.3, .02, 5, 5, Math.PI / 2)).rotateX(Math.PI), 
        s.rotateZ(-Math.PI / 4), s.rotateX(-Math.PI / 5), s.translate(0, 2.55, .4), (r = r.clone()).color.set("red");
        let L = new THREE.Mesh(s, r);
        I.add(L), I.position.set(3, 0, 0), I.castShadow = !0, I.receiveShadow = !0, I.name = "snowman", 
        t.add(I), a.addCompoundMesh(I, 5, E), E = [], (s = new THREE.SphereGeometry(1.3, 10, 10)).translate(0, 1.3, 0), 
        E.push(s), (r = r.clone()).color.set("snow"), I = new THREE.Mesh(s, r), u = [], 
        (s = B.clone()).scale(1.35, 1.6, 1.35), s.translate(0, 2.6, 0), E.push(s), u.push(s), 
        (s = new THREE.CylinderGeometry(.1, .17, .7, 6)).rotateZ(Math.PI / 4), s.translate(.7, -.14, 0), 
        s.scale(1.5, 1.5, 1.5), s.translate(-.1, 2.6, 0), E.push(s), u.push(s), s = THREE.BufferGeometryUtils.mergeBufferGeometries(u), 
        (r = r.clone()).color.set("gold"), (h = new THREE.Mesh(s, r)).castShadow = !0, h.receiveShadow = !0, 
        I.add(h), u = [], (s = new THREE.CylinderGeometry(.1, .1, 1, 6)).rotateZ(-Math.PI / 3), 
        s.translate(1.5, 1.8, 0), E.push(s), u.push(s), (s = new THREE.CylinderGeometry(.1, .1, 1, 6)).rotateZ(Math.PI / 3), 
        s.translate(-1.3, 2.2, 0), E.push(s), u.push(s), s = THREE.BufferGeometryUtils.mergeBufferGeometries(u), 
        (r = r.clone()).color.set("saddlebrown"), d = new THREE.Mesh(s, r), I.add(d);
        let V = [];
        (s = new THREE.SphereGeometry(.12, 6, 6)).translate(0, 1.3, 1.2), V.push(s), (s = s.clone()).translate(0, .4, -.08), 
        V.push(s), (s = s.clone()).translate(0, .4, -.23), V.push(s), s = THREE.BufferGeometryUtils.mergeBufferGeometries(V), 
        (r = r.clone()).color.set("maroon");
        let U = new THREE.Mesh(s, r);
        I.add(U), (s = new THREE.SphereGeometry(.8, 10, 10)).translate(0, 3.3, 0), E.push(s), 
        (r = r.clone()).color.set("snow"), v = new THREE.Mesh(s, r), I.add(v), (s = new THREE.CylinderGeometry(.35, .35, .5, 10)).rotateZ(-Math.PI / 8), 
        s.translate(.4, 4.1, 0), E.push(s), (r = r.clone()).color.set("dodgerblue");
        let z = new THREE.Mesh(s, r);
        I.add(z), (s = new THREE.CylinderGeometry(.07, .12, .4, 6)).rotateX(Math.PI / 2), 
        s.translate(0, 3.3, .8), E.push(s), (r = r.clone()).color.set("brown"), x = new THREE.Mesh(s, r), 
        I.add(x), u = [], (s = new THREE.SphereGeometry(.09, 10, 10)).translate(-.32, 3.5, .65), 
        u.push(s), (s = s.clone()).translate(.64, 0, 0), u.push(s), s = THREE.BufferGeometryUtils.mergeBufferGeometries(u), 
        (r = r.clone()).color.set("black"), c = new THREE.Mesh(s, r), I.add(c), I.position.set(-3, 0, 0), 
        I.castShadow = !0, I.receiveShadow = !0, I.name = "snowman", t.add(I), a.addCompoundMesh(I, 5, E), 
        E = [], (s = new THREE.CapsuleGeometry(.5, .7, 4, 10)).translate(0, .9, 0), E.push(s), 
        (s = new THREE.CapsuleGeometry(.15, .8, 4, 10)).rotateZ(Math.PI / 6), s.translate(.6, 1.05, 0), 
        E.push(s), (s = new THREE.CapsuleGeometry(.15, .8, 4, 10)).rotateZ(-Math.PI / 6), 
        s.translate(-.6, 1.05, 0), E.push(s), (s = new THREE.SphereGeometry(.5, 10, 10)).translate(0, 2.1, 0), 
        E.push(s), (s = new THREE.CapsuleGeometry(.15, .5, 4, 8)).translate(.2, 2.7, 0), 
        E.push(s), (s = new THREE.CapsuleGeometry(.15, .5, 4, 8)).translate(-.2, 2.7, 0), 
        E.push(s), s = THREE.BufferGeometryUtils.mergeBufferGeometries(E), (r = r.clone()).color.set("#f6bfbc");
        const F = new THREE.Mesh(s, r);
        u = [], (s = B.clone()).scale(.78, .8, .78), s.translate(0, .8 + .9, 0), E.push(s), 
        u.push(s), (s = new THREE.CylinderGeometry(.1, .17, .7, 6)).rotateZ(Math.PI / 4), 
        s.translate(.7, -.12, 0), s.scale(.8, .75, .8), s.translate(0, .8 + .9, 0), E.push(s), 
        u.push(s), s = THREE.BufferGeometryUtils.mergeBufferGeometries(u), (r = r.clone()).color.set("crimson"), 
        (h = new THREE.Mesh(s, r)).castShadow = !0, h.receiveShadow = !0, F.add(h), (s = new THREE.SphereGeometry(.15, 5, 5)).translate(0, .9 - .3, -.5), 
        E.push(s), (r = r.clone()).color.set("snow");
        const D = new THREE.Mesh(s, r);
        D.castShadow = !0, D.receiveShadow = !0, F.add(D), u = [], (s = new THREE.SphereGeometry(.07, 10, 10)).translate(.18, 2.2, .4), 
        u.push(s), (s = s.clone()).translate(-.36, 0, 0), u.push(s), s = THREE.BufferGeometryUtils.mergeBufferGeometries(u), 
        (r = r.clone()).color.set("black"), (bunny_eye_open = new THREE.Mesh(s, r)).visible = !0, 
        F.add(bunny_eye_open), u = [];
        let Z = (s = new THREE.CapsuleGeometry(.025, .1, 4, 4)).clone();
        s.rotateZ(-Math.PI / 3), s.rotateY(Math.PI / 5), s.translate(.21, 2.24, .42), u.push(s), 
        (s = Z.clone()).rotateZ(-(Math.PI / 3 + Math.PI / 3)), s.rotateY(Math.PI / 5), s.translate(.21, 2.19, .42), 
        u.push(s), (s = Z.clone()).rotateZ(Math.PI / 3), s.rotateY(-Math.PI / 5), s.translate(-.21, 2.24, .42), 
        u.push(s), (s = Z.clone()).rotateZ(Math.PI / 3 + Math.PI / 3), s.rotateY(-Math.PI / 5), 
        s.translate(-.21, 2.19, .42), u.push(s), s = THREE.BufferGeometryUtils.mergeBufferGeometries(u), 
        r = r.clone(), (bunny_eye_close = new THREE.Mesh(s, r)).visible = !1, F.add(bunny_eye_close);
        const W = new THREE.Shape();
        W.moveTo(25, 25), W.bezierCurveTo(25, 25, 20, 0, 0, 0), W.bezierCurveTo(-30, 0, -30, 35, -30, 35), 
        W.bezierCurveTo(-30, 55, -10, 77, 25, 95), W.bezierCurveTo(60, 77, 80, 55, 80, 35), 
        W.bezierCurveTo(80, 35, 80, 0, 50, 0), W.bezierCurveTo(35, 0, 25, 25, 25, 25);
        s = new THREE.ExtrudeGeometry(W, {
            depth: 1,
            bevelEnabled: !0,
            bevelSegments: 5,
            steps: 1,
            bevelSize: 10,
            bevelThickness: 10
        }), (r = r.clone()).color.set("red");
        const O = new THREE.Mesh(s, r);
        O.scale.set(.003, .003, .003), O.position.set(.07, 1.25, .5), O.rotateZ(Math.PI), 
        O.receiveShadow = !0, F.add(O), F.castShadow = !0, F.receiveShadow = !0, F.name = "bunny", 
        t.add(F), a.addCompoundMesh(F, 0, E), (s = new THREE.CapsuleGeometry(.2, .5, 4, 10)).rotateX(Math.PI / 2), 
        s.translate(0, .2, .5), (r = r.clone()).color.set("#f6bfbc"), (w = new THREE.Mesh(s, r)).position.set(.35, 0, 0), 
        w.castShadow = !0, w.receiveShadow = !0, w.name = "leg_r", t.add(w), a.addMesh(w, 0), 
        (p = w.clone()).position.set(-.35, 0, 0), p.name = "leg_l", t.add(p), a.addMesh(p, 0), 
        s = new THREE.CylinderGeometry(0, 1.1 * m, .5, 50), (r = r.clone()).color.set("snow");
        const k = new THREE.Mesh(s, r);
        let N;
        k.receiveShadow = !0, k.position.set(0, -.25, 0), k.name = "floor", t.add(k), a.addMesh(k, 0), 
        function() {
            const n = new THREE.Raycaster(), o = new THREE.Vector2(), l = new THREE.Vector3();
            s = new THREE.SphereGeometry(.27, 10, 10), (r = r.clone()).color.set("snow");
            const d = new THREE.Mesh(s, r);
           
        }(), g ? (N = 18, e.position.set(0, 3, 15)) : N = 12;
        (o = new THREE.OrbitControls(e, n.domElement)).autoRotate = !1, o.enableDamping = !0, 
        o.enablePan = !1, o.minDistance = 2, o.maxDistance = N, o.minPolarAngle = 0, o.maxPolarAngle = Math.PI / 2, 
        o.target.set(0, m / 4, 0), o.update(), G(), window.addEventListener("resize", b);
    }();
}();

export { AmmoPhysics };