/* SPDX-License-Identifier: AGPL-3.0-or-later */
class Node {
    constructor(data) {
        this.data = data;
        this.prev = null;
        this.next = null;
    }
}

class LinkedList {
    constructor(...nodes) {
        this.size = 0;
        this.head = null;
        this.add(nodes);
    }

    add([...nodes]) {
        if (!nodes) return;

        for (const element of nodes) {
            const node = new Node(element);

            let current;
            if (this.head == null) {
                this.head = node;
            } else {
                current = this.head;

                while (current.next) {
                    current = current.next;
                }

                node.prev = current;
                current.next = node;
            }
            this.size++;
        }
    }

    toArray() {
        const array = [];
        let node = this.head;
        while (node.next) {
            array.push(node.data);
            node = node.next;
        }
        return array;
    }
}

export { Node, LinkedList };